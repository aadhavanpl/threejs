import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'

var renderer, camera, scene, mesh, canvas, controls;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5,0.5,0.5),
        new THREE.MeshBasicMaterial({ color:0x4444ff })
    )
};
var loadingManager = null;
var resources_loaded = false;

function init() {

    loadingScreen.box.position.set(0,0,5);
        loadingScreen.camera.lookAt(loadingScreen.box.position);
        loadingScreen.scene.add(loadingScreen.box);
        
        // Create a loading manager to set resources_loaded when appropriate.
        // Pass loadingManager to all resource loaders.
        loadingManager = new THREE.LoadingManager();
        
        loadingManager.onProgress = function(item, loaded, total){
            console.log(item, loaded, total);
        };
        
        loadingManager.onLoad = function(){
            console.log("loaded all resources");
            resources_loaded = true;
        };

    /**
     * Base
     */
    // Canvas
    canvas = document.querySelector('canvas.webgl')

    // Scene
    scene = new THREE.Scene()

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
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)





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
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)

    // Controls
    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    animate()
}

/**
 * Animate
 */

function animate() {
    const clock = new THREE.Clock()

    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()

        if( resources_loaded == false ){
            requestAnimationFrame(tick);
            
            loadingScreen.box.position.x -= 0.05;
            if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
            loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
            
            renderer.render(loadingScreen.scene, loadingScreen.camera);
            return; 
        }


        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()  
}

window.onload = init;