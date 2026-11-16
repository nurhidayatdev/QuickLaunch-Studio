"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Crop,
  Check,
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Image as ImageIcon,
} from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  aspectRatio?: number; // default 16 / 9
  onCropComplete: (croppedDataUrl: string) => void;
}

export default function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  aspectRatio = 16 / 9,
  onCropComplete,
}: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleExportCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;

    const canvas = document.createElement("canvas");
    const targetWidth = 1200;
    const targetHeight = Math.round(targetWidth / aspectRatio); // 675 for 16:9

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Coordinate space transformations
    ctx.save();
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Map offset coordinates to target canvas
    // Viewport width in modal is 360-480px, ratio factor:
    const scaleFactor = targetWidth / 400;
    const drawX = offset.x * scaleFactor;
    const drawY = offset.y * scaleFactor;

    // Draw scaled image centered
    const baseW = targetWidth;
    const baseH = (img.naturalHeight / img.naturalWidth) * targetWidth;

    ctx.drawImage(img, drawX - baseW / 2, drawY - baseH / 2, baseW, baseH);
    ctx.restore();

    const cropped = canvas.toDataURL("image/jpeg", 0.85);
    onCropComplete(cropped);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Crop className="h-4 w-4 text-blue-600" />
            <span>Sesuaikan & Potong Banner (16:9)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Crop Viewport Window */}
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-2">
            Geser posisi gambar atau atur zoom agar sesuai dengan rasio banner banner.
          </p>

          <div
            className="relative mx-auto w-full max-w-[440px] aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-blue-500 cursor-grab active:cursor-grabbing select-none shadow-inner flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Guide Grid Crosshairs */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 border border-white/20 z-10">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>

            {/* Transformable Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop Source"
              draggable={false}
              className="max-w-none transition-transform duration-75 pointer-events-none"
              style={{
                width: "100%",
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              }}
            />
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold flex items-center gap-1.5">
              <ZoomIn className="h-3.5 w-3.5 text-slate-400" />
              Perbesar / Zoom:
            </span>
            <span className="font-mono">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.8}
            max={2.5}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCw className="h-3.5 w-3.5 text-slate-500" />
              <span>Putar 90°</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
                setRotation(0);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Reset Posisi
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExportCrop}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/25"
          >
            <Check className="h-4 w-4" />
            <span>Terapkan Hasil Crop</span>
          </button>
        </div>
      </div>
    </div>
  );
}

