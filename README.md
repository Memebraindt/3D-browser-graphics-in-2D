# 3D-browser-graphics-in-2D
3D browser graphics in 2D projection

Refactoring v0.1

Major refactoring of the 3D engine to improve maintainability and extensibility.

Changes:
- **Modular Architecture**: Split monolithic code into logical modules:
  - `shapes.js`: Geometry data (Cube, Pyramid).
  - `engine.js`: Core math, projection, and rendering logic.
  - `scenes.js`: Scene-specific logic and update loops.
  - `index.js`: Main entry point and UI event handling.
- **DRY Implementation**: Unified rendering logic using `drawMesh` and functional transformations.
- **UI Improvements**: Centered canvas layout and added Scene Switcher (radio buttons).
- **New Feature**: Added "Trail Mode" (Alpha Trails) to visualize vertex paths without clearing the screen completely.

Refactoring v0.3
... TBA
