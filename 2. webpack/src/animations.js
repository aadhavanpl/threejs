import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

console.log(gsap)

//scene
const scene = new THREE.Scene()

//red cube
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

//renderer
const canvas = document.querySelector(".webgl")
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas

})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// const clock = new THREE.Clock()


//animations
const tick = () => {
    
    // mesh.rotation.y+=0.001
    
    // console.log('tick')
    
    // const elapsedTime = clock.getElapsedTime()
    // mesh.position.y = Math.sin(elapsedTime)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick() 

//animation using gsap
for(var i=1; i<100; i+=2) {
    gsap.to(mesh.position, {duration: 1, delay: i+1, x: 2})
    gsap.to(mesh.position, {duration: 1, delay: i+2, x: 0})
}