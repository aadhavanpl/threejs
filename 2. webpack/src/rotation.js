import './style.css'
import * as THREE from 'three'

//scene
const scene = new THREE.Scene()

//red cube
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// mesh.scale.x = 1
// mesh.scale.y = 2
// mesh.scale.z = 3

// mesh.scale.set(1, 2, 3)

// mesh.position.x = 1
// mesh.position.y = 2
// mesh.position.z = 3

// mesh.position.set(1, 2, 3)

//rotation
mesh.rotation.x = 3.14 //half a rotation

//axes helper
const axesHelper = new THREE.AxesHelper(2) //higher the number, larger the axis
scene.add(axesHelper)

//sizes
const sizes = {
    width: 800,
    height: 600
}

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height) //fov, aspect ratio
camera.position.z = 3
camera.position.x = 1
camera.position.y = 1
scene.add(camera)

camera.lookAt(mesh.position)

// console.log(mesh.position.distanceTo(camera.position))

//renderer
const canvas = document.querySelector(".webgl")
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas

})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)