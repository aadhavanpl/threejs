import './style.css'
import * as THREE from 'three'

//scene
const scene = new THREE.Scene()

//objects

const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 'red'})
)
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 'blue'})
)
group.add(cube2)

cube2.position.x = 2 

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 'green'})
)
group.add(cube3)

cube3.position.x = -2

group.position.y = 1



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
camera.position.y = 1
scene.add(camera)

//renderer
const canvas = document.querySelector(".webgl")
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas

})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)