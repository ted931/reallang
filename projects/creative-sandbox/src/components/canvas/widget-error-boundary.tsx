"use client";
import React from "react";

interface Props {
  shapeId: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: string | null;
}

export class WidgetErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, color: "#ef4444", fontSize: 13 }}>
          <p style={{ fontWeight: 600 }}>위젯 오류</p>
          <p style={{ marginTop: 4, fontSize: 12 }}>{this.state.error}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 8, padding: "4px 12px", fontSize: 12,
              border: "1px solid #ddd", borderRadius: 6, cursor: "pointer",
              background: "white",
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
