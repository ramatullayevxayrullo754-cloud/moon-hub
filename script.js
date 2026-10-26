import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ====== SAHNA ======
const container = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x05070d, 14, 32);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(6, 2.4, 7);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.7, 0);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 13;
controls.maxPolarAngle = Math.PI / 2.1;
controls.autoRotate = !reduceMotion;
controls.autoRotateSpeed = 1.0;

// ====== YORUG'LIK ======
scene.add(new THREE.HemisphereLight(0x9bbcff, 0x05070d, 0.8));

const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(5, 8, 4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 25 });
scene.add(key);

const rim = new THREE.PointLight(0x38bdf8, 30, 14);
rim.position.set(-4, 2.5, -3);
scene.add(rim);

const warm = new THREE.PointLight(0xf59e0b, 18, 12);
warm.position.set(4, 1.5, -4);
scene.add(warm);

// ====== YER ======
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(14, 64),
  new THREE.MeshStandardMaterial({ color: 0x0b1220, roughness: 0.55, metalness: 0.3 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(28, 28, 0x1e3a8a, 0x0f172a);
grid.position.y = 0.002;
grid.material.transparent = true;
grid.material.opacity = 0.35;
scene.add(grid);

// ====== MATERIALLAR ======
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.6, roughness: 0.25 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x111418, metalness: 0.4, roughness: 0.5 });
const glassMat = new THREE.MeshStandardMaterial({ color: 0x0b1020, metalness: 0.9, roughness: 0.05 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 1, roughness: 0.2 });
const tireMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 });
const lightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3c4, emissiveIntensity: 2 });
const tailMat = new THREE.MeshStandardMaterial({ color: 0xff2d2d, emissive: 0xff0000, emissiveIntensity: 1.5 });
const accentMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5, roughness: 0.3 });

// ====== MASHINA ======
const car = new THREE.Group();
scene.add(car);

function addBox(w, h, d, mat, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  car.add(mesh);
  return mesh;
}

// Kuzov
addBox(4.2, 0.45, 1.9, bodyMat, 0, 0.55, 0);      // shassi
addBox(0.8, 0.3, 1.8, bodyMat, 1.9, 0.5, 0);      // old burun
addBox(1.9, 0.5, 1.5, glassMat, 0.1, 1.0, 0);     // oyna
addBox(1.4, 0.2, 1.3, bodyMat, -0.1, 1.35, 0);    // tom
addBox(1.0, 0.25, 1.7, bodyMat, -1.6, 0.9, 0);    // orqa qism
addBox(0.3, 0.08, 2.0, darkMat, 2.25, 0.2, 0);    // old splitter

// Orqa spoyler
addBox(0.1, 0.45, 0.1, darkMat, -2.0, 1.15, 0.7);
addBox(0.1, 0.45, 0.1, darkMat, -2.0, 1.15, -0.7);
addBox(0.5, 0.08, 2.0, darkMat, -2.1, 1.45, 0);
addBox(0.5, 0.25, 0.04, accentMat, -2.1, 1.35, 1.0);
addBox(0.5, 0.25, 0.04, accentMat, -2.1, 1.35, -1.0);

// Chiroqlar
addBox(0.05, 0.12, 0.5, lightMat, 2.31, 0.7, 0.55);
addBox(0.05, 0.12, 0.5, lightMat, 2.31, 0.7, -0.55);
addBox(0.05, 0.1, 1.4, tailMat, -2.12, 0.8, 0);

// Yon tomonidagi "MOON" belgisi
function makeBadgeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1d4ed8";
  ctx.font = "bold 64px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MOON", 128, 132);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const badgeMat = new THREE.MeshBasicMaterial({ map: makeBadgeTexture(), transparent: true });
const badgeRight = new THREE.Mesh(new THREE.CircleGeometry(0.3, 48), badgeMat);
badgeRight.position.set(-0.3, 0.7, 0.962);
car.add(badgeRight);
const badgeLeft = badgeRight.clone();
badgeLeft.position.set(-0.3, 0.7, -0.962);
badgeLeft.rotation.y = Math.PI;
car.add(badgeLeft);

// G'ildiraklar (har biri aylanadi)
const wheels = [];
function addWheel(x, z) {
  const spinner = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.34, 32), tireMat);
  tire.rotation.x = Math.PI / 2;
  const rimMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.36, 24), rimMat);
  rimMesh.rotation.x = Math.PI / 2;
  spinner.add(tire, rimMesh);
  spinner.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });

  const holder = new THREE.Group();
  holder.position.set(x, 0.36, z);
  holder.add(spinner);
  car.add(holder);
  wheels.push(spinner);
}
addWheel(1.35, 1.0);
addWheel(1.35, -1.0);
addWheel(-1.35, 1.0);
addWheel(-1.35, -1.0);

// ====== ANIMATSIYA ======
const clock = new THREE.Clock();
let elapsed = reduceMotion ? 3 : 0;
const INTRO = 2.6;

function animate() {
  const dt = clock.getDelta();
  elapsed += dt;

  // Mashina chapdan kirib keladi
  const p = Math.min(elapsed / INTRO, 1);
  const e = 1 - Math.pow(1 - p, 3);
  car.position.x = (1 - e) * -9;
  car.position.y = Math.sin(elapsed * 2) * 0.02 * e;

  // G'ildiraklar kirish paytida tez, keyin sekin aylanadi
  const speed = 3 + 15 * (1 - e);
  wheels.forEach((w) => {
    w.rotation.z -= speed * dt;
  });

  // Chiroqlar rangi asta o'zgaradi
  rim.color.setHSL((elapsed * 0.05) % 1, 0.9, 0.6);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
