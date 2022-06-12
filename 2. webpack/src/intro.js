import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'


const loadingManager = new THREE.LoadingManager(
    //loading
    () => {
        gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
        console.log('loaded')
    },
    //progress
    () => {
        console.log('progress')
    }
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// overlay
const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }    
    `,
    fragmentShader: `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)












//object
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2)

//triangle
const geometry = new THREE.Geometry()
// const vertex1 = new THREE.Vector3(0, 0, 0)
// geometry.vertices.push(vertex1)
// const vertex2 = new THREE.Vector3(0, 1, 0)
// geometry.vertices.push(vertex2)
// const vertex3 = new THREE.Vector3(1, 0, 0)
// geometry.vertices.push(vertex3)

// const face = new THREE.Face3(0, 1, 2)
// geometry.faces.push(face)

// random triangles
for(let i =0; i<50; i++) {
    for(let j = 0; j< 3; j++) {
        geometry.vertices.push(new THREE.Vector3(
            Math.random(), //gives value from 0 to 1
            Math.random(),
            Math.random()
        ))
    }

    const verticesIndex = i*3
    geometry.faces.push(new THREE.Face3(
        verticesIndex,
        verticesIndex+1,
        verticesIndex+2
    ))
}

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//when we resize the window, we update the height and width. we also need to update the components where height and width are used
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    //update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
    if(!document.fullscreenElement) {
        canvas.requestFullscreen()
    }
    else if(document.fullscreenElement) {
        document.exitFullscreen()
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()  