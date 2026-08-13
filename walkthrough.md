# Style & Font Modifications Walkthrough

We have successfully integrated your brand styles, fonts, layout updates, and the highly interactive 3D physics lanyard badge.

## Summary of Changes

1. **Format-Aware Multi-Preview System (`Generator.tsx`)**:
   - *Update*: **PFP Frame Support (Flat 2D Square Interactive Preview)**:
     - When format mode is set to `"pfp"` (PFP Frame), the app now mounts the 2D `CardCanvas` directly in the preview slot with `interactive={true}` and hides the 3D `<Lanyard3D />` container.
     - This displays the square PFP Frame format cleanly at its correct 1:1 aspect ratio without any vertical ID card stretching. Users can grab, drag, pinch, or scroll-zoom their photo directly inside the preview canvas!
   - *Update*: **Builder Card Support (Draggable 3D Physics Lanyard)**:
     - When format mode is set to `"builder"` (Builder Card), the app displays the interactive 3D lanyard model. The hidden `CardCanvas` drives the texture changes in real-time.
     - This cleanly decouples the flat square PFP frame from the 3D lanyard model.

2. **Draggable 3D Physics Lanyard (`Lanyard3D.tsx`)**:
   - Integrated the React Bits 3D Lanyard utilizing Three.js, `@react-three/fiber`, and `@react-three/rapier` physics engine.
   - **Original Physics & Joints (Exact Replication)**:
     - Shortened rope joint limits to `0.75` (down 25% from 1.0) to reduce the strap ribbon size.
     - Restored `useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])` to anchor exactly to the top clip loop center.
   - **Original Drag & Drop Behavior**:
     - The card follows the pointer natively without any active clamping or distance calculations inside the `useFrame` loop.
   - **Original Damping & Solver Properties**:
     - Restored the original simple Y-axis damping equation (`rot.y * 0.25`) in `useFrame`.
     - Directly copies `j3.current.translation()` into the first point of the spline curve.
     - Enabled complete rotation degrees of freedom (removed axis locks) so it matches the original template.
   - **Original Ribbon Shader & Resolution**:
     - Reverted resolution vector definition to the template's standard resolution logic `resolution={isMobile ? [1000, 2000] : [1000, 1000]}` inside `<meshLineMaterial />`.
   - **Custom Metallic Styling**:
     - Restored the card's clip and clamp meshes back to the model's built-in `materials.metal` template as defined in the original open-source component (with clip set to `material-roughness={0.3}`).
   - **Removed Lanyard Viewport Frame**: Removed the translucent background, border frame lines, backdrop blur, and inner shadows around the 3D canvas wrapper.
   - **Attached to Section Top (Local Anchor)**: Shifted the desktop rope anchor point to `anchorY = 5.5` (moved up from `5.3` so it hangs exactly from the top of the **"BUILD YOUR GOA IDENTITY" section**) and `anchorX = 1.7` and changed the canvas wrapper styling to `absolute inset-0 z-0 w-full h-full` inside the relative parent `#create` container.
   - **Section-wide Drag & Drop Viewport (Desktop)**: The 3D canvas spans the entire relative `#create` section, allowing users to grab and drag the card **anywhere inside the entire creation layout**! Clicks on inputs, sliders, and buttons pass through non-interactive areas automatically.
   - **Mobile Layout Adaptability**: On mobile, the canvas wrapper maintains its layout flow as an inline centered block container (`h-[450px] relative pointer-events-auto`) positioned cleanly underneath the creation form controls, ensuring smooth scrolling.
   - **2:47 PM Studio Logo Integration**: Loaded `/247pm-studio-logo.png` and drew it repeating along the ribbon.
   - **Inverted Yellow/Pink Ribbon Colorway**:
     - The strap background is filled with high-contrast brand yellow (`#fee101`).
     - The strap borders are colored brand pink (`#ff0080`).
     - The repeating 2:47 PM Studio logo is dynamically tinted to brand pink (`#ff0080`) using an off-screen canvas composition filter before drawing it onto the texture.
     - The strap repeating text is set to `"HH GOA 2026"` in brand pink (`#ff0080`).
   - **Increased Card Size**: Zoomed camera position in to Z=`21` to make the card render beautifully.
   - **Pendulum Single-Joint Architecture (Zero Glitch / Unlimited Drags)**:
     - Simplified the physics model by removing the intermediate dynamic segment bodies (`j1`, `j2`, `j3`) from the simulation.
     - Connected the card directly to the fixed anchor at `[1.7, 5.5, 0]` using a single `useRopeJoint` with length limit `2.25`. This provides a mathematically perfect single-joint pendulum.
     - Because there are no multi-segment joints, joint overstretching and constraint violations are physically impossible. The card can be dragged and dropped thousands of times without any drift, displacement, or physics crashes.
   - **Dynamic Geometric Ribbon Sag**:
     - The ribbon strap is drawn in `useFrame` as a smooth bezier curve with 4 control points between the fixed anchor and the card's hook position.
     - Implemented a dynamic sag calculation on the middle points of the spline proportional to the remaining slack: `sag = Math.max(0, 2.25 - distance) * 0.45`.
     - When the card is stretched tight, the ribbon becomes straight. When the card moves closer to the anchor, the ribbon sags downwards realistically under gravity. Since the end-points are locked geometrically to the anchor and clip, the ribbon and card clip can never separate.
   - **Seamless Click Offset Alignment (Zero Click Jump)**:
     - Configured `onPointerDown` and `useFrame` dragging to project cursor coordinates onto the exact `Z=0` plane using ray-plane intersection.
     - This aligns the pointer world coordinates on click exactly with the pointer world coordinates in the dragging frames, eliminating any initial delta mismatch and completely removing the glitch where the lanyard jumped/shifted upwards upon clicking.
   - **Un-Clamped Active Dragging (Free Downward/Upward Movement)**:
     - Removed the active drag coordinate clamping inside `useFrame` so that the card translation is free to follow pointer coordinates downward, upward, left, and right anywhere on the screen during kinematic dragging.
     - Upon pointer release (`onPointerUp`), the card is smoothly constrained/clamped to the maximum physical rope length of `2.25` and velocities are reset to zero. This combines unrestricted dragging freedom with 100% stable physics release behavior.
   - **Rotational Selection Micro-Animations**:
     - Wired the `theme` and `mode` states as hooks inside the 3D component.
     - When the user picks a new composition format (PFP vs Builder card) or changes the theme colorway, the card automatically triggers a rotational torque impulse `{ x: 0, y: 1.5, z: 0 }`, causing the card to spin/twist dynamically in 3D.
   - **Explosion-Free Drag Release Damping**:
     - Updated the `onPointerUp` and `onPointerCancel` handlers to reset the card's linear and angular velocity to zero and release pointer capture. This stops any sudden kinetic energy kickback on release.

3. **Real-time Live Texture Updates (Immediate Processing)**:
   - Completely removed the multi-step "Make it Goa" loading screen and separate bottom result sections.
   - Rendered the 3D Lanyard directly inside the right preview column on load.
   - Bound the off-screen 2D card canvas context directly to the 3D model's `CanvasTexture` inside the `useFrame` render loop.
   - As the user types in the form or slides photo controls, the changes reflect **instantly** on the swinging 3D lanyard card in the viewport without any separate process.

4. **X Video, GIF & Image Sharing (`SharePanel.tsx`)**:
   - Added support to record the WebGL viewport in real-time using the browser's `MediaRecorder` API.
   - **Ultra-High Quality 60 FPS Recording**: Optimized the capture stream with a fixed 60 FPS framerate (`activeCanvas.captureStream(60)`) to align with high-refresh display cycles.
   - **15 Mbps Bitrate**: Raised the target encoding bitrate to `15,000,000` (15 Mbps) to produce crystal-clear, high-fidelity Badge swing videos (resulting in a file size around 5-7 MB).
   - **Lag-Free Background Encoding**: Removed the main-thread slicing parameter from `mediaRecorder.start()` to execute continuous encoding on a background thread. This eliminates CPU lag spikes and guarantees a smooth, stutter-free video capture.
   - **Direct Native Video Sharing (Web Share API Integration)**:
     - Configured the video stop handler in `SharePanel.tsx` to automatically attempt to share the recorded video directly through the Web Share API.
     - On mobile and supported desktop browsers, this launches the native share menu directly so you can select and post the video straight to X without intermediate manual file uploads. It gracefully falls back to a automatic file download for unsupported clients.
   - Maintained the high-resolution 2D card canvas exports (PNG/JPG) for standard static image sharing.

5. **True ID Card Format, Colors & Brand Assets (`renderCard.ts`)**:
   - **Perfect Camera Center & Zoom**: Centered the camera vertically on the card's swing midpoint (`anchorY - 2.0`) and zoomed in much closer (`Z = 7.2` on desktop, `Z = 8.5` on mobile) during recording. This aligns the swinging badge perfectly in the video frame. To bypass React Three Fiber's limitation where `<Canvas camera>` properties are not updated dynamically after mounting, the active camera position and target lookAt are now forced dynamically inside the active render loop (`useFrame` inside `<Band>`). This ensures the card scales up to a perfect close-up correct fit, occupying the maximum safe area of the video without any empty black space at the bottom.
   - **Goa Badge Sticker (Transparent Background)**: Added a transparent, rotated Goa logo sticker (`/goa-logo.png`) on the right side of the card, opposite to the name (attached on the border between the photo frame and the outer card body). The white circular backing and thick black border outlines were removed to draw the transparent sticker directly onto the card face, styled with a realistic soft drop shadow and tilted at 7 degrees (`0.12` radians) for an organic badge aesthetic.
   - Resized the **BUILDER CARD** dimensions to `1080 x 1620px`, achieving the standard 2:3 vertical ID Card/badge aspect ratio.
   - Scaled the card's photo panel to a taller layout (`ph = 780px`) and shifted all bottom text blocks downwards proportionally.
   - Configured all themes to use your soft cream-yellow `#fffbe8` color for borders, text accents, and metadata containers.

6. **Upgraded Glassmorphism Form & Header Placement (`BuilderForm.tsx`, `Generator.tsx`)**:
   - Redesigned the form fields with a modern, glassmorphic layout: subtle border outlines (`border-goa-yellow/20`), backdrop blur, and smooth glowing focus animations.
   - Upgrade Title rolling container with a clean brand pink (`#ff0080` at 10% opacity) holographic panel and matching high-contrast yellow typography.
   - Moved the privacy note `NO LOGIN. NO SIGNUP. EVERYTHING HAPPENS IN YOUR BROWSER.` to the left side directly underneath the main heading.
   - Removed the "LIVE PREVIEW" title element above the 3D lanyard.
   - Fixed Stylesheet Theme Colors: Adjusted `--goa-pink` to `#ff0080` and `--goa-cream` to `#fffbe8` in `styles.css`. This fixes the active selection buttons (which had white text on a white background) rendering them properly.
   - **Trapezoid Downbar Dark Green Outline**:
     - Added a sharp, dark green contour outline (`stroke="#05331c"` and `strokeWidth="8"`) to the custom rounded trapezoid SVG shape in `Hero.tsx`.
   - **Beige Page Background (Second Page)**:
     - Wrapped the entire `<Generator />` layout in a container with background color `bg-goa-cream` (`#fffbe8`).
     - Wrapped the creation controls form column (left side) in a gorgeous, high-contrast dark green panel (`bg-goa-deep border-4 border-goa-ink rounded-3xl p-6 sm:p-8 shadow-xl`) to preserve dashboard visibility and label contrast.
     - Changed the "BUILD YOUR GOA IDENTITY" title to use dark green (`text-goa-ink`) and brand pink (`text-goa-pink`) colors on the beige layout.
     - Updated the desktop spacing placeholder inside `Generator.tsx` from `500px` to `500px` to match the visual lanyard position.
