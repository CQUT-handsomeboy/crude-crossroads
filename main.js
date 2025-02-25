import * as THREE from "three";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { array } from "three/tsl";

const scene = new THREE.Scene();

// 设置环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// 设置平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

// 设置正交相机
const aspectRatio = window.innerWidth / window.innerHeight;

const camera = new THREE.PerspectiveCamera(
  100, // field of view in degrees
  aspectRatio, // aspect ratio
  1, // near plane
  1000 // far plane
);

camera.position.set(0, 100, 0);
camera.lookAt(0, 0, 0);

function Tree() {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(10, 100, 10),
    new THREE.MeshLambertMaterial({ color: 0x552a0c })
  );

  const leaves = new THREE.Mesh(
    new THREE.BoxGeometry(40, 40, 40),
    new THREE.MeshLambertMaterial({ color: 0x00ff00 })
  );
  leaves.position.y = 60;

  tree.add(trunk);  
  tree.add(leaves);

  return tree;
}


function createWheels() {
  const geometry = new THREE.BoxGeometry(12, 12, 33);
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wheel = new THREE.Mesh(geometry, material);
  return wheel;
}

function createCar() {
  const car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);

  const main = new THREE.Mesh(
    new THREE.BoxGeometry(60, 15, 30),
    new THREE.MeshLambertMaterial({ color: 0xa52523 })
  );
  main.position.y = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();

  const carBackTexture = getCarFrontTexture();

  const carRightSideTexture = getCarSideTexture();

  const carLeftSideTexture = getCarSideTexture();
  carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
  carLeftSideTexture.rotation = Math.PI;
  carLeftSideTexture.flipY = false;

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(33, 12, 24),
    [
      new THREE.MeshLambertMaterial({ map: carFrontTexture }),
      new THREE.MeshLambertMaterial({ map: carBackTexture }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }),
      new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
      new THREE.MeshLambertMaterial({ map: carLeftSideTexture })
    ]
  );
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);

  return car;
}

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
}

function getIslands() {
  const leftUpIsland = new THREE.Shape();

  leftUpIsland.moveTo(0 - mapWidth / 2, mapHeight / 2);
  leftUpIsland.lineTo(0 - trackWidth, mapHeight / 2);
  leftUpIsland.lineTo(0 - trackWidth, trackWidth);
  leftUpIsland.lineTo(0 - mapWidth / 2, trackWidth);

  const leftDownIsland = new THREE.Shape();
  leftDownIsland.moveTo(0 - mapWidth / 2, -mapHeight / 2);
  leftDownIsland.lineTo(0 - trackWidth, -mapHeight / 2);
  leftDownIsland.lineTo(0 - trackWidth, -trackWidth);
  leftDownIsland.lineTo(0 - mapWidth / 2, -1 * trackWidth);

  const rightUpIsland = new THREE.Shape();
  rightUpIsland.moveTo(mapWidth / 2, mapHeight / 2);
  rightUpIsland.lineTo(trackWidth, mapHeight / 2);
  rightUpIsland.lineTo(trackWidth, trackWidth);
  rightUpIsland.lineTo(mapWidth / 2, trackWidth);

  const rightDownIsland = new THREE.Shape();
  rightDownIsland.moveTo(mapWidth / 2, -mapHeight / 2);
  rightDownIsland.lineTo(trackWidth, -mapHeight / 2);
  rightDownIsland.lineTo(trackWidth, -trackWidth);
  rightDownIsland.lineTo(mapWidth / 2, -trackWidth);

  return [leftUpIsland, leftDownIsland, rightUpIsland, rightDownIsland];
}

function getLineMarkings(mapWidth, mapHeight) {
  const canvas = document.createElement("canvas");
  canvas.width = mapWidth;
  canvas.height = mapHeight;
  const context = canvas.getContext("2d");

  context.fillStyle = "#546E90";
  context.fillRect(0, 0, mapWidth, mapHeight);

  context.lineWidth = 4;
  context.strokeStyle = "#FFFFFF";

  // context.setLineDash([45, 15]);

  context.beginPath();
  context.moveTo(0, mapHeight / 2);
  context.lineTo(mapWidth, mapHeight / 2);
  context.stroke();

  context.beginPath();
  context.moveTo(mapWidth / 2, 0);
  context.lineTo(mapWidth / 2, mapHeight);
  context.stroke();

  context.setLineDash([10, 5]);
  context.beginPath();
  
  context.moveTo(0, mapHeight / 2 - trackWidth /2);
  context.lineTo(mapWidth, mapHeight / 2 - trackWidth /2);
  context.moveTo(0, mapHeight / 2 + trackWidth /2);
  context.lineTo(mapWidth, mapHeight / 2 + trackWidth /2);

  context.moveTo(mapWidth / 2 - trackWidth/2, 0);
  context.lineTo(mapWidth / 2 - trackWidth/2, mapHeight);
  context.moveTo(mapWidth / 2 + trackWidth/2, 0);
  context.lineTo(mapWidth / 2 + trackWidth/2, mapHeight);

  context.stroke();


  return new THREE.CanvasTexture(canvas)
}

function setTrafficLight() {
  const height = 75;
  const w = 10;
  const trafficLightGroup = new THREE.Group();

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(w, height, w),
    new THREE.MeshStandardMaterial({ 
      color: 0x888888,
      metalness: 0.8,
    })
  );

  const redlight = new THREE.Mesh(
    new THREE.BoxGeometry(w, w, w),
    new THREE.MeshStandardMaterial({ 
      color: 0xFF0000,
      metalness: 0.8,
    })
  );

  const greenlight = new THREE.Mesh(
    new THREE.BoxGeometry(w, w, w),
    new THREE.MeshStandardMaterial({
      color: 0x00FF00,
      metalness: 0.8,
    })
  );

  const yellowLight = new THREE.Mesh(
    new THREE.BoxGeometry(w, w, w),
    new THREE.MeshStandardMaterial({
      color: 0xFFFF00,
      metalness: 0.8,
    }) 
  );

  box.position.y = height / 2;
  redlight.position.y = 90;
  greenlight.position.y = 90 + w;
  yellowLight.position.y = 90 + 2 * w;

  trafficLightGroup.add(box);
  trafficLightGroup.add(redlight);
  trafficLightGroup.add(greenlight);
  trafficLightGroup.add(yellowLight);

  trafficLightGroup.position.set(-1 * trackWidth, 0, -1 * trackWidth);

  scene.add(trafficLightGroup);
}

function renderMap(mapWidth, mapHeight) {
  const planeGeometry = new THREE.PlaneGeometry(mapWidth, mapHeight);
  const texture = getLineMarkings(mapWidth, mapHeight);
  const planeMaterial = new THREE.MeshLambertMaterial({
    // color: 0x546190,
    map: texture
  });
  const islands = getIslands();
  const islandsGeometry = new THREE.ExtrudeGeometry(islands, {
    depth: 10,
    bevelEnabled: false,
  });

  [[mapHeight/5, 0, mapHeight/5],[-1*mapHeight/5, 0, mapHeight/5],[-1*mapHeight/5, 0, -1*mapHeight/5],[mapHeight/5, 0, -1*mapHeight/5]].forEach((face) => {
    const tree = new Tree();
    const [x, y, z] = face;
    tree.position.set(x, y, z);
    scene.add(tree);
  })

  const islandsMesh = new THREE.Mesh(islandsGeometry, [
    new THREE.MeshLambertMaterial({ color: 0x67c240 }),
    new THREE.MeshLambertMaterial({ color: 0x23311c }),
  ]);

  setTrafficLight();

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -Math.PI / 2;
  islandsMesh.rotation.x = -Math.PI / 2;

  scene.add(islandsMesh)
  scene.add(plane);
}

const mapHeight = 1000;
const mapWidth = 1000;
const trackWidth = 100; // 马路宽度

renderMap(mapHeight, mapWidth);

const car = createCar();
scene.add(car);
car.position.set(-1*mapWidth/2 + 30,0,trackWidth/4)

// 设置渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

renderer.setAnimationLoop((t) => {
})

const v = new THREE.Vector3(0, 0, 0);
const rotationSpeed = 0.05;

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      v.x = +10;
      break;
    case "s":
      v.x = -10;
      break;
    case "a":
      car.rotation.y += rotationSpeed;
      break;
    case "d":
      car.rotation.y -= rotationSpeed;
      break;
  }
  
  const moveVector = new THREE.Vector3(v.x, 0,0);
  moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
  car.position.add(moveVector);
  
  renderer.render(scene, camera);
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
    case "s":
      v.x = 0;
      break;
  }
  renderer.render(scene, camera);
});

const controls = new OrbitControls(camera, renderer.domElement);


let controlMode = "FOLLOW_CAR";

function animate() {
  requestAnimationFrame(animate);

  switch (controlMode) {
    case "FOLLOW_CAR":
      const relativeCameraOffset = new THREE.Vector3(-100, 100, 0); // 相机相对于车的偏移
      const cameraOffset = relativeCameraOffset.clone();
      cameraOffset.applyMatrix4(car.matrixWorld);
      camera.position.copy(cameraOffset);
      camera.lookAt(car.position);
      break;

    case "FREE":
      controls.update();
      break;
  }

  renderer.render(scene, camera);
}

animate();

document.body.appendChild(renderer.domElement);
const button = document.createElement('button');

button.textContent = '跟随汽车视角';
button.style.position = 'absolute';
button.style.top = '20px';
button.style.left = '20px';
button.style.zIndex = '1000';
button.onclick = () => {
 if (controlMode === "FOLLOW_CAR") {
   controlMode = "FREE";
   button.textContent = '自由视角';
 } else {
   controlMode = "FOLLOW_CAR";
   button.textContent = '跟随汽车视角';
 }
}
document.body.appendChild(button);
