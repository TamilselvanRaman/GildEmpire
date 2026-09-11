'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { mysteryAudio } from '@/utils/mysteryAudio';

export type BowlState =
  | 'IDLE'
  | 'BUILDUP'
  | 'SHAKING'
  | 'LETTER_SELECTED'
  | 'LETTER_ESCAPING'
  | 'BOTTLE_DISSOLVING'
  | 'REVEAL'
  | 'COMPLETE';

export type BottleState = BowlState;

interface GlassBowlSceneProps {
  currentState: BowlState;
  onStateTransition: (nextState: BowlState) => void;
  onFortuneSelected?: (fortuneIndex: number) => void;
  onBowlClick?: () => void;
  chitCount?: number;
  winnerText?: string;
  reducedMotion?: boolean;
}

interface ChitObjectData {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  homePos: THREE.Vector3;
  homeRot: THREE.Euler;
  floatPhase: number;
  slotNumber: number;
}

export const GlassBottleScene: React.FC<GlassBowlSceneProps> = ({
  currentState,
  onStateTransition,
  onFortuneSelected,
  onBowlClick,
  chitCount = 49,
  winnerText,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<BowlState>(currentState);
  const stateTimeRef = useRef<number>(0);

  stateRef.current = currentState;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const cameraZ = width < 768 ? 7.8 : 6.6;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.15, cameraZ);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // --- LIGHTING (Warm Golden Studio Lighting) ---
    const ambientLight = new THREE.AmbientLight(0xfff3d6, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffd700, 1.8);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb3861b, 0.9);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe89e, 2.5);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const bowlCenterLight = new THREE.PointLight(0xffd700, 1.8, 10);
    bowlCenterLight.position.set(0, 0.1, 0);
    scene.add(bowlCenterLight);

    // --- GOLDEN BOKEH & SPARKLE PARTICLES ---
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 11;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 7;
      particleSpeeds[i] = 0.002 + Math.random() * 0.004;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      pGrad.addColorStop(0, 'rgba(255, 248, 231, 1)');
      pGrad.addColorStop(0.35, 'rgba(245, 215, 110, 0.85)');
      pGrad.addColorStop(0.8, 'rgba(212, 175, 55, 0.25)');
      pGrad.addColorStop(1, 'rgba(8, 7, 6, 0)');
      pCtx.fillStyle = pGrad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- BACKGROUND GOLDEN ARC RING ---
    const bgArcGeo = new THREE.TorusGeometry(3.6, 0.018, 16, 64);
    const bgArcMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const bgArc = new THREE.Mesh(bgArcGeo, bgArcMat);
    bgArc.position.set(0, 0.3, -2.5);
    scene.add(bgArc);

    // --- MAIN BOWL GROUP ---
    const mainGroup = new THREE.Group();
    mainGroup.position.set(0, -0.2, 0);
    scene.add(mainGroup);

    // 1. SPHERICAL GLASS FISHBOWL LATHE PROFILE
    const bowlPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.0, -1.25),
      new THREE.Vector2(0.65, -1.24),
      new THREE.Vector2(1.25, -1.05),
      new THREE.Vector2(1.68, -0.65),
      new THREE.Vector2(1.85, -0.1),
      new THREE.Vector2(1.84, 0.35),
      new THREE.Vector2(1.65, 0.8),
      new THREE.Vector2(1.35, 1.15),
      new THREE.Vector2(1.22, 1.25), // open top rim
      new THREE.Vector2(1.28, 1.3),  // flared lip top
      new THREE.Vector2(1.15, 1.28), // inner lip curve
      new THREE.Vector2(1.1, 1.15),
      new THREE.Vector2(1.4, 0.75),
      new THREE.Vector2(1.58, 0.3),
      new THREE.Vector2(1.58, -0.1),
      new THREE.Vector2(1.42, -0.55),
      new THREE.Vector2(1.05, -0.92),
      new THREE.Vector2(0.5, -1.1),
      new THREE.Vector2(0.0, -1.12),
    ];

    const bowlGeo = new THREE.LatheGeometry(bowlPoints, 64);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfffef5,
      transmission: 0.96,
      opacity: 1.0,
      transparent: true,
      roughness: 0.04,
      ior: 1.52,
      thickness: 1.4,
      specularIntensity: 2.0,
      specularColor: new THREE.Color(0xffe89e),
      attenuationColor: new THREE.Color(0xf5d76e),
      attenuationDistance: 1.8,
      side: THREE.DoubleSide,
    });
    const glassMesh = new THREE.Mesh(bowlGeo, glassMaterial);
    mainGroup.add(glassMesh);

    // Golden Top Lip Rim Highlight Ring
    const lipRingGeo = new THREE.TorusGeometry(1.25, 0.03, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0x5e450b,
      emissiveIntensity: 0.4,
    });
    const lipRing = new THREE.Mesh(lipRingGeo, goldMat);
    lipRing.rotation.x = Math.PI / 2;
    lipRing.position.y = 1.27;
    mainGroup.add(lipRing);

    // 2. METALLIC GOLD CIRCULAR PEDESTAL STAND AT BASE
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.25, 0);

    // Upper platform tier
    const pedTopGeo = new THREE.CylinderGeometry(1.62, 1.72, 0.28, 64);
    const pedTopMesh = new THREE.Mesh(pedTopGeo, goldMat);
    pedTopMesh.position.y = -0.14;
    pedestalGroup.add(pedTopMesh);

    // Pedestal top rim ring
    const pedRingGeo1 = new THREE.TorusGeometry(1.65, 0.04, 16, 64);
    const pedRing1 = new THREE.Mesh(pedRingGeo1, goldMat);
    pedRing1.rotation.x = Math.PI / 2;
    pedRing1.position.y = 0.0;
    pedestalGroup.add(pedRing1);

    // Lower base tier
    const pedBaseGeo = new THREE.CylinderGeometry(1.82, 1.9, 0.35, 64);
    const pedBaseMesh = new THREE.Mesh(pedBaseGeo, goldMat);
    pedBaseMesh.position.y = -0.45;
    pedestalGroup.add(pedBaseMesh);

    // Pedestal bottom glow ring
    const pedRingGeo2 = new THREE.TorusGeometry(1.88, 0.035, 16, 64);
    const pedRing2 = new THREE.Mesh(pedRingGeo2, goldMat);
    pedRing2.rotation.x = Math.PI / 2;
    pedRing2.position.y = -0.62;
    pedestalGroup.add(pedRing2);

    mainGroup.add(pedestalGroup);

    // --- 49 FOLDED PAPER CHITS INSIDE THE BOWL ---
    const chitsGroup = new THREE.Group();
    mainGroup.add(chitsGroup);

    const chitGeo = new THREE.PlaneGeometry(0.34, 0.34, 4, 4);
    const posAttr = chitGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = -Math.abs(x) * 0.16;
      posAttr.setZ(i, z);
    }
    chitGeo.computeVertexNormals();

    const chitObjects: ChitObjectData[] = [];
    const actualCount = Math.min(Math.max(chitCount, 1), 60);

    for (let i = 0; i < actualCount; i++) {
      const slotNum = i + 1;
      const lCanvas = document.createElement('canvas');
      lCanvas.width = 128;
      lCanvas.height = 128;
      const lCtx = lCanvas.getContext('2d');
      if (lCtx) {
        // Parchment ivory background with golden edges
        lCtx.fillStyle = '#FFF6E0';
        lCtx.fillRect(0, 0, 128, 128);
        lCtx.fillStyle = 'rgba(212, 175, 55, 0.2)';
        lCtx.fillRect(4, 4, 120, 120);

        // Handwritten ink script lines
        lCtx.strokeStyle = 'rgba(122, 91, 20, 0.4)';
        lCtx.lineWidth = 2;
        lCtx.beginPath();
        lCtx.moveTo(20, 40); lCtx.lineTo(108, 40);
        lCtx.moveTo(20, 64); lCtx.lineTo(108, 64);
        lCtx.moveTo(20, 88); lCtx.lineTo(80, 88);
        lCtx.stroke();

        // Golden slot number stamp
        lCtx.fillStyle = '#A67C21';
        lCtx.font = 'bold 24px serif';
        lCtx.textAlign = 'center';
        lCtx.textBaseline = 'middle';
        lCtx.fillText(`#${slotNum}`, 64, 64);
      }

      const lTex = new THREE.CanvasTexture(lCanvas);
      const lMat = new THREE.MeshStandardMaterial({
        map: lTex,
        color: 0xfffdf5,
        roughness: 0.6,
        metalness: 0.15,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(chitGeo, lMat);
      
      // Pile chits naturally inside spherical bowl belly (r < 1.35, y from -0.8 to 0.4)
      const r = Math.pow(Math.random(), 0.5) * 1.3;
      const theta = Math.random() * Math.PI * 2;
      const py = -0.75 + Math.random() * 1.15;

      const px = r * Math.cos(theta);
      const pz = r * Math.sin(theta);

      mesh.position.set(px, py, pz);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      mesh.scale.setScalar(0.8 + Math.random() * 0.3);

      chitsGroup.add(mesh);

      chitObjects.push({
        mesh,
        homePos: new THREE.Vector3(px, py, pz),
        homeRot: mesh.rotation.clone(),
        floatPhase: Math.random() * Math.PI * 2,
        slotNumber: slotNum,
      });
    }

    // Parallax motion tracking
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = mouseX * 0.3;
      targetRotX = mouseY * 0.2;
    };

    const handleClick = () => {
      if (onBowlClick && stateRef.current === 'IDLE') {
        onBowlClick();
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    const clock = new THREE.Clock();
    let animId: number;

    let selectedIdx = -1;
    let selectedMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> | null = null;

    // --- ANIMATION LOOP ---
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      stateTimeRef.current += delta;
      const sTime = stateTimeRef.current;
      const cState = stateRef.current;

      // Particle Drift
      const pAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let py = pAttr.getY(i) + particleSpeeds[i];
        if (py > 4.5) py = -4.0;
        pAttr.setY(i, py);
      }
      pAttr.needsUpdate = true;
      particleSystem.rotation.y = time * 0.015;

      switch (cState) {
        case 'IDLE': {
          mainGroup.position.y = -0.2 + Math.sin(time * 1.2) * 0.05;
          mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;
          mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;

          chitObjects.forEach((obj) => {
            obj.mesh.position.y = obj.homePos.y + Math.sin(time * 1.5 + obj.floatPhase) * 0.03;
            obj.mesh.rotation.y = obj.homeRot.y + Math.sin(time * 0.8 + obj.floatPhase) * 0.04;
          });
          break;
        }

        case 'BUILDUP': {
          if (selectedIdx === -1 && chitObjects.length > 0) {
            selectedIdx = Math.floor(Math.random() * chitObjects.length);
            selectedMesh = chitObjects[selectedIdx].mesh;
            if (onFortuneSelected) onFortuneSelected(selectedIdx);
          }

          const progress = Math.min(sTime / (reducedMotion ? 0.2 : 0.4), 1.0);
          bowlCenterLight.intensity = 1.8 + progress * 2.5;
          mainGroup.position.x = (Math.random() - 0.5) * 0.05 * progress;
          mainGroup.position.y = -0.2 + (Math.random() - 0.5) * 0.05 * progress;

          if (sTime >= (reducedMotion ? 0.2 : 0.4)) {
            stateTimeRef.current = 0;
            onStateTransition('SHAKING');
          }
          break;
        }

        case 'SHAKING': {
          const shakeDuration = reducedMotion ? 0.8 : 1.8;
          const progress = Math.min(sTime / shakeDuration, 1.0);
          const envelope = Math.sin(progress * Math.PI);

          const freq = reducedMotion ? 12.0 : 18.0;
          const amplitude = reducedMotion ? 0.15 : 0.35;

          // Smooth horizontal right-to-left sway physics
          mainGroup.position.x = Math.sin(time * freq) * amplitude * envelope;
          mainGroup.position.y = -0.2;
          mainGroup.rotation.z = Math.sin(time * freq) * 0.1 * envelope;

          if (Math.random() < 0.18) mysteryAudio.playShakeClink();

          chitObjects.forEach((obj) => {
            const jitter = 0.22 * envelope;
            obj.mesh.position.x += (Math.random() - 0.5) * jitter;
            obj.mesh.position.y += (Math.random() - 0.5) * jitter;
            obj.mesh.position.z += (Math.random() - 0.5) * jitter;

            const dist = obj.mesh.position.length();
            if (dist > 1.45) {
              obj.mesh.position.normalize().multiplyScalar(1.35);
            }
            obj.mesh.rotation.x += (Math.random() - 0.5) * 0.45 * envelope;
            obj.mesh.rotation.y += (Math.random() - 0.5) * 0.45 * envelope;
          });

          if (sTime >= shakeDuration) {
            stateTimeRef.current = 0;
            mysteryAudio.playChime(587.33, 'triangle', 0.6, 0.2);
            onStateTransition('LETTER_SELECTED');
          }
          break;
        }

        case 'LETTER_SELECTED': {
          if (selectedMesh) {
            selectedMesh.material.emissive.setHex(0xf5d76e);
            selectedMesh.material.emissiveIntensity = Math.min(sTime * 3.0, 2.0);
          }

          chitObjects.forEach((obj, idx) => {
            if (idx !== selectedIdx) {
              obj.mesh.material.opacity = Math.max(0.3, 1.0 - sTime * 1.2);
            }
          });

          if (sTime >= 0.5) {
            stateTimeRef.current = 0;
            mysteryAudio.playGoldenAscend();
            onStateTransition('LETTER_ESCAPING');
          }
          break;
        }

        case 'LETTER_ESCAPING': {
          const escapeDuration = reducedMotion ? 1.0 : 1.6;
          const t = Math.min(sTime / escapeDuration, 1.0);
          const easeOutCubic = 1 - Math.pow(1 - t, 3);

          if (selectedMesh) {
            selectedMesh.position.x = THREE.MathUtils.lerp(selectedMesh.position.x, 0, 0.08);
            selectedMesh.position.z = THREE.MathUtils.lerp(selectedMesh.position.z, 0, 0.08);
            selectedMesh.position.y = -0.2 + easeOutCubic * 3.4;

            selectedMesh.rotation.y += delta * 2.2;
            selectedMesh.rotation.x = Math.sin(time * 2.0) * 0.2;
            selectedMesh.scale.setScalar(0.9 + easeOutCubic * 0.6);
          }

          if (sTime >= escapeDuration) {
            stateTimeRef.current = 0;
            mysteryAudio.playChime(880, 'sine', 1.5, 0.2);
            onStateTransition('BOTTLE_DISSOLVING');
          }
          break;
        }

        case 'BOTTLE_DISSOLVING': {
          const dissolveDuration = reducedMotion ? 0.6 : 1.1;
          const t = Math.min(sTime / dissolveDuration, 1.0);

          glassMaterial.opacity = 1.0 - t;
          glassMaterial.transmission = Math.max(0, 0.96 * (1.0 - t));
          mainGroup.scale.setScalar(1.0 - t * 0.25);

          chitObjects.forEach((obj, idx) => {
            if (idx !== selectedIdx) {
              obj.mesh.material.opacity = Math.max(0, 0.3 * (1.0 - t));
              if (t >= 0.99) obj.mesh.visible = false;
            }
          });

          if (selectedMesh) {
            selectedMesh.position.y = THREE.MathUtils.lerp(selectedMesh.position.y, 0.6, 0.06);
            selectedMesh.position.z = THREE.MathUtils.lerp(selectedMesh.position.z, 3.8, 0.06);
            selectedMesh.scale.setScalar(1.5 + t * 1.5);
            selectedMesh.rotation.y += delta * 1.2;
          }

          if (sTime >= dissolveDuration) {
            stateTimeRef.current = 0;
            glassMesh.visible = false;
            mysteryAudio.playRevealSparkle();
            onStateTransition('REVEAL');
          }
          break;
        }

        case 'REVEAL': {
          if (selectedMesh) {
            selectedMesh.rotation.y += delta * 0.8;
            selectedMesh.position.y = 0.5 + Math.sin(time * 1.5) * 0.08;
          }
          break;
        }

        case 'COMPLETE': {
          if (selectedMesh) {
            selectedMesh.rotation.y += delta * 0.5;
            selectedMesh.position.y = 0.5 + Math.sin(time * 1.2) * 0.05;
          }
          break;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Reset loop
    const checkReset = () => {
      if (stateRef.current === 'IDLE' && glassMesh.visible === false) {
        glassMesh.visible = true;
        glassMaterial.opacity = 1.0;
        glassMaterial.transmission = 0.96;

        mainGroup.position.set(0, -0.2, 0);
        mainGroup.rotation.set(0, 0, 0);
        mainGroup.scale.set(1, 1, 1);

        selectedIdx = -1;
        selectedMesh = null;

        chitObjects.forEach((obj) => {
          obj.mesh.position.copy(obj.homePos);
          obj.mesh.rotation.copy(obj.homeRot);
          obj.mesh.scale.setScalar(0.8 + Math.random() * 0.3);
          obj.mesh.material.opacity = 1.0;
          obj.mesh.material.emissive.setHex(0x000000);
          obj.mesh.visible = true;
        });
      }
    };

    const intervalId = setInterval(checkReset, 200);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.position.z = width < 768 ? 7.8 : 6.6;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
      cancelAnimationFrame(animId);

      // Disposal
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      bgArcGeo.dispose();
      bgArcMat.dispose();
      bowlGeo.dispose();
      glassMaterial.dispose();
      goldMat.dispose();
      lipRingGeo.dispose();
      pedTopGeo.dispose();
      pedBaseGeo.dispose();
      pedRingGeo1.dispose();
      pedRingGeo2.dispose();
      chitGeo.dispose();
      chitObjects.forEach((o) => {
        o.mesh.material.map?.dispose();
        o.mesh.material.dispose();
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [chitCount, reducedMotion, onBowlClick, onFortuneSelected, onStateTransition]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing" />;
};
