import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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

// ====== MASHINA (haqiqiy 3D model) ======
const car = new THREE.Group();
scene.add(car);

const loadingEl = document.createElement("div");
loadingEl.textContent = "Yuklanmoqda…";
loadingEl.style.cssText =
  "position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);color:#94a3b8;" +
  "font-family:system-ui,sans-serif;letter-spacing:0.1em;z-index:5;pointer-events:none;";
document.body.appendChild(loadingEl);

const loader = new GLTFLoader();
loader.load(
  "porsche-992-gt3-r.glb",
  (gltf) => {
    const model = gltf.scene;
    model.updateMatrixWorld(true);

    // Agar model yotiq holatda bo'lsa, to'g'rilash
    let box = new THREE.Box3().setFromObject(model);
    let size = box.getSize(new THREE.Vector3());
    if (size.y > size.x && size.y > size.z) {
      model.rotation.x = -Math.PI / 2;
      model.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(model);
      size = box.getSize(new THREE.Vector3());
    }

    // Uzunligi taxminan 4.4 birlikka keltirish
    const longest = Math.max(size.x, size.z);
    model.scale.setScalar(4.4 / longest);
    model.updateMatrixWorld(true);

    // Markazlash va yerga tekkizish
    box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;

    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    // Kuzov rangini lime-yashil qilib bo'yash (Porsche 911 GT3 R uslubida)
    model.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        if (m.name === "EXT_Carpaint_Inst") {
          m.color.set(0xb8f000);
          m.metalness = 0.3;
          m.roughness = 0.3;
          m.needsUpdate = true;
        }
      });
    });

    car.add(model);
    loadingEl.remove();
  },
  (xhr) => {
    if (xhr.total) {
      loadingEl.textContent = `Yuklanmoqda… ${Math.round((xhr.loaded / xhr.total) * 100)}%`;
    }
  },
  (err) => {
    loadingEl.textContent = "Model yuklanmadi";
    console.error(err);
  }
);

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
