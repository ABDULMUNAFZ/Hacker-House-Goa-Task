/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };

// Read directly from the public folder to avoid bundler loading issues in SSR
const cardGLB = '/card.glb';
const studioLogoImage = '/247pm-studio-logo.png';
const lanyardStrapPattern = '/lanyard.png';

interface LanyardProps {
  id?: string;
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  canvas: HTMLCanvasElement | null;
  lanyardWidth?: number;
  onWebGLCanvas?: (el: HTMLCanvasElement) => void;
  theme?: string;
  mode?: string;
  isRecording?: boolean;
}

export default function Lanyard3D(props: LanyardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a clean placeholder on the server during SSR compilation
  if (!mounted) {
    return (
      <div className="relative w-full h-[450px] flex justify-center items-center" />
    );
  }

  return <Lanyard3DImpl {...props} />;
}

function Lanyard3DImpl({
  id = "lanyard-3d-canvas",
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  canvas = null,
  lanyardWidth = 1.1,
  onWebGLCanvas,
  theme,
  mode,
  isRecording = false
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive container styles: Inline box on mobile/tablet, section-bound overlay on desktop
  const containerClass = isMobile
    ? "relative z-0 w-full h-[450px] flex justify-center items-center overflow-hidden select-none bg-goa-deep/10 rounded-2xl border border-goa-yellow/10"
    : "absolute inset-0 z-0 w-full h-full overflow-hidden select-none pointer-events-none";

  // Anchor offset (Centered on mobile, shifted back to the right side on desktop - unless recording!)
  const anchorX = isMobile ? 0 : (isRecording ? 0 : 1.7);
  const anchorY = isMobile ? 3.3 : 5.5;

  // During recording, focus camera directly on the card body (anchorY - 2.2) to center it beautifully
  const activePosition: [number, number, number] = isRecording 
    ? [0, anchorY - 2.2, isMobile ? 11.0 : 10.2] 
    : (position || [0, 0, 20]);

  // Single Canvas that NEVER unmounts — this fixes the empty video data error.
  // When recording, the same canvas is wrapped in a fullscreen overlay via CSS.
  // The camera adapts dynamically via useFrame inside Band.
  return (
    <>
      {/* Recording backdrop overlay */}
      {isRecording && (
        <div className="fixed inset-0 z-40 bg-[#000d07]/95 backdrop-blur-md pointer-events-none" />
      )}

      {/* Recording status text */}
      {isRecording && (
        <div className="fixed top-8 left-0 right-0 z-[52] text-center pointer-events-none">
          <p className="font-mono text-sm text-goa-yellow tracking-widest animate-pulse uppercase font-bold">
            RECORDING 3D LANYARD VIDEO...
          </p>
          <p className="font-body text-[10px] text-goa-cream/60 mt-1">
            Please keep this tab active and visible
          </p>
        </div>
      )}

      {/* Canvas container — CSS changes but the Canvas itself stays mounted */}
      <div
        id={`lanyard-recording-container-${id}`}
        className={isRecording
          ? "fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-auto select-none"
          : containerClass
        }
      >
        <div className={isRecording
          ? "relative w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden border border-goa-yellow/30 bg-[#00160b]/90 shadow-2xl"
          : "w-full h-full"
        }>
          <Canvas
            id={id}
            camera={{ position: activePosition, fov }}
            dpr={isRecording ? 4.0 : (isMobile ? 1.5 : 2)}
            gl={{ alpha: transparent, preserveDrawingBuffer: true, antialias: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
              if (onWebGLCanvas) onWebGLCanvas(gl.domElement);
            }}
            style={(!isMobile && !isRecording) ? { pointerEvents: 'auto' } : undefined}
          >
            <ambientLight intensity={Math.PI} />
            <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
              <Band
                key={isRecording ? "rec" : "norm"}
                isMobile={isMobile}
                canvas={canvas}
                lanyardWidth={lanyardWidth}
                anchorX={anchorX}
                anchorY={anchorY}
                theme={theme}
                mode={mode}
                isRecording={isRecording}
                position={position}
              />
            </Physics>
            <Environment blur={0.75}>
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Canvas>
        </div>
      </div>
    </>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  canvas?: HTMLCanvasElement | null;
  lanyardWidth?: number;
  anchorX: number;
  anchorY: number;
  theme?: string | undefined;
  mode?: string | undefined;
  isRecording?: boolean;
  position?: [number, number, number] | undefined;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  canvas = null,
  lanyardWidth = 1.1,
  anchorX,
  anchorY,
  theme,
  mode,
  isRecording = false,
  position = [0, 0, 20]
}: BandProps) {
  const { size } = useThree();
  const band = useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  // Persistent lerped Vector3 for the hook world position — starts null so first frame snaps
  const hookLerped = useRef<THREE.Vector3 | null>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  // Dynamic MeshLine resolution vector based on current rendering viewport size
  const resolutionVec = useMemo(() => new THREE.Vector2(size.width, size.height), [size.width, size.height]);

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }
    return body.lerped;
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardStrapPattern);

  // Create a dynamic HTML canvas texture for the strap/tie ribbon in brand yellow #fee101 with pink texts
  const strapTexture = useMemo(() => {
    const canvasEl = document.createElement("canvas");
    canvasEl.width = 1024;
    canvasEl.height = 64;
    
    const ctx = canvasEl.getContext("2d");
    if (ctx) {
      // 1. Fill background with brand yellow
      ctx.fillStyle = "#fee101";
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
      
      // 2. Draw border lines in brand pink
      ctx.strokeStyle = "#ff0080";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(canvasEl.width, 4);
      ctx.moveTo(0, canvasEl.height - 4);
      ctx.lineTo(canvasEl.width, canvasEl.height - 4);
      ctx.stroke();
      
      // 3. Draw fallback text segments in brand pink
      ctx.fillStyle = "#ff0080";
      ctx.font = "bold 24px \"Victor Mono\", monospace";
      ctx.textBaseline = "middle";
      
      const repeats = 3;
      for (let i = 0; i < repeats; i++) {
        const xOffset = (i * canvasEl.width) / repeats;
        ctx.fillText("HH GOA 2026", xOffset + 140, canvasEl.height / 2);
      }
    }
    
    const tex = new THREE.CanvasTexture(canvasEl);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    
    return { canvas: canvasEl, tex };
  }, []);

  // Asynchronously load the 2:47 PM Studio logo, tint it pink, and draw it repeating on the strap texture canvas
  useEffect(() => {
    const img = new Image();
    img.src = studioLogoImage;
    img.onload = () => {
      // Create offscreen canvas to tint the yellow logo image to brand pink #ff0080
      const tintCanvas = document.createElement("canvas");
      tintCanvas.width = img.width;
      tintCanvas.height = img.height;
      const tintCtx = tintCanvas.getContext("2d");
      if (tintCtx) {
        tintCtx.drawImage(img, 0, 0);
        tintCtx.globalCompositeOperation = "source-in";
        tintCtx.fillStyle = "#ff0080";
        tintCtx.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
      }

      const ctx = strapTexture.canvas.getContext("2d");
      if (ctx) {
        const repeats = 3;
        for (let i = 0; i < repeats; i++) {
          const xOffset = (i * strapTexture.canvas.width) / repeats;
          // Draw the pink-tinted logo next to the repeating text
          ctx.drawImage(tintCanvas, xOffset + 35, 12, 65, 40);
        }
        strapTexture.tex.needsUpdate = true;
      }
    };
  }, [strapTexture]);

  // Composite canvas atlas elements for the card front
  const compositeCanvas = useMemo(() => document.createElement('canvas'), []);
  const compositeCtx = useMemo(() => compositeCanvas.getContext('2d'), [compositeCanvas]);
  
  // Baked texture base for card edges and details
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    const baseImg = baseMap.image as any;
    
    // Scale up composition resolution for high-quality readable text tags
    compositeCanvas.width = 2048;
    compositeCanvas.height = 2048;
    
    if (compositeCtx) {
      compositeCtx.drawImage(baseImg, 0, 0, 2048, 2048);
    }
    
    const compositeTex = new THREE.CanvasTexture(compositeCanvas);
    compositeTex.colorSpace = THREE.SRGBColorSpace;
    compositeTex.flipY = baseMap.flipY;
    compositeTex.anisotropy = 16;
    compositeTex.needsUpdate = true;
    
    return compositeTex;
  }, [compositeCanvas, compositeCtx, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  const isPFP = mode === 'pfp';
  
  // Keep joint coordinates constant to maintain perfect alignment in both UI and Video
  const hookY = isPFP ? 1.03 : 1.45;
  const hookZ = 0.0;

  // Reduce the ribbon joint length during recording to roughly half size as requested
  const ropeLength = isRecording ? 0.8 : 2.25;

  // Stable direct rope joint between the anchor and the card hook
  useRopeJoint(fixed, card, [
    [0, 0, 0],
    [0, hookY, hookZ],
    ropeLength
  ]);

  const prevRecording = useRef(false);
  const recordingStartTime = useRef(0);
  const lastTextureUpdateRef = useRef(0);

  // Synchronize physics positions when anchor coordinates change
  useEffect(() => {
    if (fixed.current) {
      fixed.current.setTranslation({ x: anchorX, y: anchorY, z: 0 }, true);
    }
  }, [anchorX, anchorY]);

  useEffect(() => {
    if (isRecording && !prevRecording.current) {
      if (card.current && fixed.current) {
        // Move anchor to center [0, anchorY, 0] during recording
        fixed.current.setTranslation({ x: 0, y: anchorY, z: 0 }, true);

        // Jump from right to left: start card on the right (x: 0.6), velocity pushing it left (x: -3.2)
        // Set Y start exactly matching ropeLength + hookY to prevent vertical yanking glitches
        card.current.setTranslation({ x: 0.6, y: anchorY - ropeLength - hookY, z: 0 }, true);
        card.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        card.current.setLinvel({ x: -2.5, y: 0, z: 0 }, true); 
        card.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        
        // Low damping to allow natural swings back and forth
        card.current.setLinearDamping(0.6);
        card.current.setAngularDamping(0.6);
      }
      recordingStartTime.current = performance.now();
    } else if (!isRecording && prevRecording.current) {
      // Restore card to its exact pre-recording position and state
      if (card.current && fixed.current) {
        fixed.current.setTranslation({ x: anchorX, y: anchorY, z: 0 }, true);
        card.current.setTranslation({ x: anchorX, y: anchorY - 4.0, z: 0 }, true);
        card.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        card.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        card.current.setLinearDamping(2.0);
        card.current.setAngularDamping(2.0);
      }
    }
    prevRecording.current = isRecording;
  }, [isRecording, anchorX, anchorY, ropeLength, hookY]);

  // Torque impulse micro-animation triggered whenever composition theme/format changes
  useEffect(() => {
    if (card.current) {
      card.current.applyTorqueImpulse({ x: 0, y: 1.5, z: 0 }, true);
    }
  }, [theme, mode]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    // Dynamically update camera position and target during recording vs editing
    // R3F does not update the camera instance properties dynamically from Canvas props after mount.
    const targetCamZ = isRecording ? (isMobile ? 11.0 : 10.2) : position[2];
    const targetCamY = isRecording ? anchorY - 2.2 : position[1];
    const targetCamX = isRecording ? 0 : position[0];

    state.camera.position.set(targetCamX, targetCamY, targetCamZ);
    if (isRecording) {
      state.camera.lookAt(0, anchorY - 2.2, 0);
    } else {
      state.camera.lookAt(0, 0, 0);
    }

    // Kinematic translation update for drag & drop
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.copy(state.camera.position).addScaledVector(dir, -state.camera.position.z / dir.z);
      [card, fixed].forEach(ref => ref.current?.wakeUp());

      const targetPos = new THREE.Vector3(
        vec.x - dragged.x,
        vec.y - dragged.y,
        vec.z - dragged.z
      );

      card.current?.setNextKinematicTranslation(targetPos);
    }

    // Live update the texture from the 2D canvas preview
    // Throttle live texture updates to reduce GPU memory bandwidth pressure during scrolling
    const nowFrame = state.clock.getElapsedTime();
    if (canvas && compositeCtx && (isRecording || dragged || nowFrame - lastTextureUpdateRef.current > 0.15)) {
      lastTextureUpdateRef.current = nowFrame;
      const W = compositeCanvas.width;
      const H = compositeCanvas.height;
      
      // 1. Draw to the front UV rect (left half)
      const rx = FRONT_UV_RECT.x * W;
      const ry = FRONT_UV_RECT.y * H;
      const rw = FRONT_UV_RECT.w * W;
      const rh = FRONT_UV_RECT.h * H;
      
      compositeCtx.save();
      compositeCtx.clearRect(rx, ry, rw, rh);
      compositeCtx.beginPath();
      compositeCtx.rect(rx, ry, rw, rh);
      compositeCtx.clip();
      compositeCtx.drawImage(canvas, rx, ry, rw, rh);
      compositeCtx.restore();

      // 2. Draw to the back UV rect (right half, mirrored horizontally and rotated 180deg to correct UV layout tilt)
      const bx = 0.5 * W;
      const by = 0;
      const bw = 0.5 * W;
      const bh = 0.755 * H;

      compositeCtx.save();
      compositeCtx.clearRect(bx, by, bw, bh);
      compositeCtx.beginPath();
      compositeCtx.rect(bx, by, bw, bh);
      compositeCtx.clip();
      
      // Translate to center of back face, mirror horizontally, rotate 180deg, then draw canvas centered
      compositeCtx.translate(bx + bw / 2, by + bh / 2);
      compositeCtx.scale(-1, 1);
      compositeCtx.rotate(Math.PI);
      compositeCtx.drawImage(canvas, -bw / 2, -bh / 2, bw, bh);
      compositeCtx.restore();
      
      cardMap.needsUpdate = true;
    }

    if (fixed.current && card.current) {
      const anchorVec = new THREE.Vector3(anchorX, anchorY, 0);
      const cardTrans = card.current.translation();
      const cardRot = card.current.rotation();
      const q = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);

      // Calculate the world position of the card's hook (using hookZ visual alignment offset)
      const hookPos = new THREE.Vector3(0, hookY, hookZ).applyQuaternion(q).add(new THREE.Vector3(cardTrans.x, cardTrans.y, cardTrans.z));

      // Calculate path and distance
      const dirVec = new THREE.Vector3().subVectors(hookPos, anchorVec);
      const len = dirVec.length();

      // Interpolate points for the ribbon curve
      const pts = curve.points;
      if (pts && pts.length >= 4) {
        const p3 = pts[3];
        const p2 = pts[2];
        const p1 = pts[1];
        const p0 = pts[0];
        if (p0 && p1 && p2 && p3) {
          p3.copy(anchorVec);
          p2.lerpVectors(anchorVec, hookPos, 1 / 3);
          p1.lerpVectors(anchorVec, hookPos, 2 / 3);
          p0.copy(hookPos);

          // Apply a realistic gravity sag to the ribbon strap if closer than max rope length
          const sag = Math.max(0, ropeLength - len) * 0.45;
          if (sag > 0) {
            p2.y -= sag * 1.25;
            p1.y -= sag * 1.25;
          }
        }
      }

      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));

      if (isRecording && recordingStartTime.current > 0) {
        const elapsed = (performance.now() - recordingStartTime.current) / 1000;
        if (elapsed > 0) {
          if (elapsed < 3.5) {
            // Low damping to allow 4 natural swings back and forth (right to left, left to right, right to left, left to right)
            card.current.setLinearDamping(0.5);
            card.current.setAngularDamping(0.5);
          } else if (elapsed < 4.5) {
            // Settle in center (moderate damping)
            card.current.setLinearDamping(8.0);
            card.current.setAngularDamping(8.0);
          } else {
            // Stop completely still and wait 2 seconds (very high damping)
            card.current.setLinearDamping(45.0);
            card.current.setAngularDamping(45.0);
          }
        }
      }

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = 'chordal';
  strapTexture.tex.wrapS = strapTexture.tex.wrapT = THREE.RepeatWrapping;

  return (
    <>
      {/* Absolute group container. Children positions are relative to the group origin (0,0,0) */}
      <group>
        <RigidBody ref={fixed} position={[anchorX, anchorY, 0]} {...segmentProps} type="fixed" />
        <RigidBody 
          position={isRecording ? [0.6, anchorY - ropeLength - hookY, 0] : [anchorX, anchorY - 2.0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          enabledRotations={isRecording ? [false, false, true] : [true, true, true]}
        >
          <CuboidCollider args={[0.8, isPFP ? 0.8 : 1.125, 0.01]} />
          <group
            scale={isPFP ? [2.25, 1.6, 2.25] : 2.25}
            position={[0, isPFP ? -0.85 : -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);

              if (fixed.current && card.current) {
                const anchorPos = fixed.current.translation();
                const cardTrans = card.current.translation();
                const cardRot = card.current.rotation();
                
                const anchorVec = new THREE.Vector3(anchorPos.x, anchorPos.y, anchorPos.z);
                const cardVec = new THREE.Vector3(cardTrans.x, cardTrans.y, cardTrans.z);
                const q = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);

                // Calculate the world position of the card's hook (using hookZ visual alignment offset)
                const hookPos = new THREE.Vector3(0, hookY, hookZ).applyQuaternion(q).add(cardVec);

                // If the hook is dragged too far from the anchor, clamp the card position
                const dirVec = new THREE.Vector3().subVectors(hookPos, anchorVec);
                const dist = dirVec.length();
                const maxLen = 2.25;

                if (dist > maxLen) {
                  dirVec.normalize();
                  // Clamp hook position
                  const clampedHookPos = new THREE.Vector3().addVectors(anchorVec, dirVec.clone().multiplyScalar(maxLen));
                  // Card center = clampedHookPos - rotation * [0, hookY, hookZ]
                  const offset = new THREE.Vector3(0, hookY, hookZ).applyQuaternion(q);
                  const clampedCardPos = new THREE.Vector3().subVectors(clampedHookPos, offset);
                  card.current.setTranslation(clampedCardPos, true);

                  // Zero out velocities to prevent explosive kickback forces ONLY when clamped beyond boundaries
                  card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
                  card.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
                }
              }
            }}
            onPointerCancel={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              
              const clickVec = new THREE.Vector3();
              const clickDir = new THREE.Vector3();
              
              clickVec.set(e.pointer.x, e.pointer.y, 0.5).unproject(e.camera);
              clickDir.copy(clickVec).sub(e.camera.position).normalize();
              clickVec.copy(e.camera.position).addScaledVector(clickDir, -e.camera.position.z / clickDir.z);
              
              drag(new THREE.Vector3().copy(clickVec).sub(card.current.translation()));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry}>
              <meshPhysicalMaterial
                color="#ff0080"
                roughness={0.1}
                metalness={0.0}
                clearcoat={1}
                clearcoatRoughness={0.1}
                emissive="#ff0080"
                emissiveIntensity={0.15}
              />
            </mesh>
            <mesh geometry={nodes.clamp.geometry}>
              <meshPhysicalMaterial
                color="#ff0080"
                roughness={0.1}
                metalness={0.0}
                clearcoat={1}
                clearcoatRoughness={0.1}
                emissive="#ff0080"
                emissiveIntensity={0.15}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>
      
      {/* Single hanging ribbon strap — fully matching original template properties */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={strapTexture.tex}
          repeat={[1, 1]}
          lineWidth={isRecording ? lanyardWidth * 0.75 : lanyardWidth}
        />
      </mesh>
    </>
  );
}

if (typeof window !== 'undefined') {
  useGLTF.preload(cardGLB);
  useTexture.preload(studioLogoImage);
  useTexture.preload(lanyardStrapPattern);
}
