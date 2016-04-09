
(function() {
  var camera, scene, renderer;
  var handMesh;
  var virtualHandshakeEl;
  var color;

  init();
  update();

  window.onresize = resize;

  function init() {
    virtualHandshakeEl = document.querySelector('.virtual-handshake');

    color = {r: 255, g: 0, b: 0};

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    loadHand(function(mesh) {
      handMesh = mesh;

      handMesh.rotation.z += 0.25;

      handMesh.scale.set(200, 200, 200);

      scene.add(handMesh);
    });
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function update() {
    window.requestAnimationFrame(update);

    if (handMesh) {
      handMesh.rotation.y -= 0.02;

      updateColor();
    }

    renderer.render(scene, camera);
  }

  function loadHand(callback) {
    if (!callback) return;

    var loader = new THREE.JSONLoader();

    loader.load('models/low_poly_arm.json', function (geometry, materials) {
      var material = new THREE.MultiMaterial(materials);
      var mesh = new THREE.Mesh(geometry, material);

      callback(mesh);
    });
  }

  function updateColor() {
    if (color.r === 255 && color.g < 255 && color.b === 0) {
      color.g += 1;
    }
    else if (color.g === 255 && color.r > 0) {
      color.r -= 1;
    }
    else if (color.g === 255 && color.b < 255) {
      color.b += 1;
    }
    else if (color.b === 255 && color.g > 0) {
      color.g -= 1;
    }
    else if (color.b === 255 && color.r < 255) {
      color.r += 1;
    }
    else if (color.r === 255 && color.b > 0) {
      color.b -= 1;
    }

    var rgb = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';

    var materials = handMesh.material.materials;
    for (var i = 0; i < materials.length; i++) {
      var material = materials[i];
      material.color = new THREE.Color(rgb);
      material.ambient = new THREE.Color(rgb);
      material.emissive = new THREE.Color(rgb);
      material.needsUpdate = true;
    }

    virtualHandshakeEl.style.color = rgb;
  }

})();
