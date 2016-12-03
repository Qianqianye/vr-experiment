function setOrientationControls(e) {
    if (!e.alpha) {
        return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    window.removeEventListener('deviceorientation', setOrientationControls, true);

    if (renderer.domElement) {
        renderer.domElement.addEventListener('click', function () {

            if (this.requestFullscreen) {
                this.requestFullscreen();
            } else if (this.msRequestFullscreen) {
                this.msRequestFullscreen();
            } else if (this.mozRequestFullScreen) {
                this.mozRequestFullScreen();
            } else if (this.webkitRequestFullscreen) {
                this.webkitRequestFullscreen();
            }

        });

        renderer = new THREE.StereoEffect(renderer);
        renderer.setSize(window.innerWidth, window.innerHeight);

        mobile = true;

    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function getCubeMap(i) {
    var cubeMap = new THREE.Texture([]);
    cubeMap.format = THREE.RGBFormat;
    cubeMap.flipY = false;

    var envMaps = [
        {file: "matrix.jpg", size: 1024},
        {file: "pattern-bg.jpg", size: 1024},
        {file: "space.jpg", size: 1024},
        

    ];

    var loader = new THREE.ImageLoader();
    var pre = "assets/textures/";
    var file = pre + envMaps[i].file;
    var size = envMaps[i].size;
    loader.load(file, function (image) {
        var getSide = function (x, y) {

            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            var context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;

        };

        cubeMap.image[ 0 ] = getSide(2, 1); // px
        cubeMap.image[ 1 ] = getSide(0, 1); // nx
        cubeMap.image[ 2 ] = getSide(1, 0); // py
        cubeMap.image[ 3 ] = getSide(1, 2); // ny
        cubeMap.image[ 4 ] = getSide(1, 1); // pz
        cubeMap.image[ 5 ] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;

    });

    return cubeMap;
}