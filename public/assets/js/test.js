var camera, scene, renderer, geometry, material, mesh;

init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x1300fa );

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 900;

    geometry = new THREE.CubeGeometry(200, 200, 200);
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);
    
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    
    
    renderer.render(scene, camera);


}

 <script type="text/javascript">
        
        function setup() {
          createCanvas(windowWidth, windowHeight);
          background(0);
          hue = 0;
        }

        function draw() {
          // background(220);
        }

        function mouseDragged() {
          if (hue > 360) {
            hue = 0;
          } else {
            hue += 10;
          }
          colorMode(HSL, 360);
          noStroke();
          fill(hue, 200, 200);
          ellipse(mouseX, mouseY, 3, 3);
        }

        function keyPressed() {
          if (keyCode == 82) {
              hue = 0;
          }
        }
          
      
      </script>