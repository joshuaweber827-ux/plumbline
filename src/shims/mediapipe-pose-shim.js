// @mediapipe/pose is a global-script package, not real ESM, and pulls in
// large wasm binaries we never use since this app only loads MoveNet.
// pose-detection statically imports `Pose` from it for its (unused) BlazePose
// backend, so this shim satisfies that import without bundling the package.
export const Pose = undefined
