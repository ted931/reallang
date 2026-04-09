"use client";

import {
  BaseBoxShapeUtil,
  HTMLContainer,
  type TLBaseShape,
  type TLResizeInfo,
  resizeBox,
} from "tldraw";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { WidgetErrorBoundary } from "./widget-error-boundary";
import { createCheatkeyScope } from "@/lib/cheatkey/scope";
import React from "react";

export type LiveWidgetShape = TLBaseShape<
  "live-widget",
  {
    code: string;
    w: number;
    h: number;
    title: string;
  }
>;

const cheatkeyFns = createCheatkeyScope();

const SCOPE = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  ...cheatkeyFns,
};

export class LiveWidgetShapeUtil extends BaseBoxShapeUtil<LiveWidgetShape> {
  static override type = "live-widget" as const;

  getDefaultProps(): LiveWidgetShape["props"] {
    return {
      code: '() => <div style={{padding:16,textAlign:"center"}}>Hello World</div>',
      w: 320,
      h: 240,
      title: "Widget",
    };
  }

  component(shape: LiveWidgetShape) {
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: shape.props.w,
          height: shape.props.h,
          overflow: "auto",
          pointerEvents: "all",
          background: "white",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onPointerMove={(e) => e.stopPropagation()}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Title bar */}
          <div
            style={{
              padding: "4px 8px",
              background: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              fontSize: 11,
              color: "#6b7280",
              fontWeight: 500,
              borderRadius: "8px 8px 0 0",
              pointerEvents: "none",
            }}
          >
            {shape.props.title}
          </div>

          <WidgetErrorBoundary shapeId={shape.id}>
            <LiveProvider code={shape.props.code} scope={SCOPE} noInline={false}>
              <LivePreview />
              <LiveError
                style={{
                  color: "#ef4444",
                  fontSize: 12,
                  padding: 8,
                  whiteSpace: "pre-wrap",
                  background: "#fef2f2",
                }}
              />
            </LiveProvider>
          </WidgetErrorBoundary>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: LiveWidgetShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} ry={8} />;
  }

  override onResize(shape: LiveWidgetShape, info: TLResizeInfo<LiveWidgetShape>) {
    return resizeBox(shape, info);
  }
}
