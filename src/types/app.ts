export type AppMode =
  | "idle"
  | "camera_requested"
  | "camera_ready"
  | "demo_ready"
  | "snapshot_captured"
  | "error";

export type SnapshotSource = "camera" | "demo";

export type DemoScene = {
  id: string;
  title: string;
  description: string;
  src: string;
};

export type Snapshot = {
  source: SnapshotSource;
  imageUrl: string;
  capturedAt: string;
};
