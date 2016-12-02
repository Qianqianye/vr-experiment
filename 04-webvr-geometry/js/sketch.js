            var user = false;

            var camera, scene, renderer;
            var effect;
            var mobile = false;
            var globe
            var group

            init();
            animate();

            function init() {

                // setup

                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setClearColor(0)
                document.body.appendChild(renderer.domElement);

                scene = new THREE.Scene();

                camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.set(0, 0, 3);
                camera.focalLength = camera.position.distanceTo(scene.position);
                camera.lookAt(scene.position);

                controls = new THREE.OrbitControls(camera);
                controls.autoRotate = true;
                controls.enablePan = false;

                // central object

                var cubeMap = getCubeMap(1)

                var material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, envMap: getCubeMap(1), color: 0xFFFFFF, shading: THREE.FlatShading});
                var geometry = new THREE.SphereGeometry(2.6, 50, 50);
                var geometry = new THREE.CubeGeometry(1, 1, 1);

                 // add noise surface
                // var mod = .3;
                // for (var i = 0; i < geometry.vertices.length; i++) {
                //     var v = geometry.vertices[i]
                //     var ran = Math.random()
                //     v.x *= ran;
                //     v.y *= ran;
                //     v.z *= ran;
                // }
                globe = new THREE.Mesh(geometry, material);
                scene.add(globe);




                // cubes

                // group = new THREE.Object3D();
                // for (var _x = -3; _x <= 3; _x++) {
                //     for (var _y = -3; _y <= 3; _y++) {
                //         for (var _z = -3; _z <= 3; _z++) {
                //             var geo = new THREE.BoxGeometry(.1, .1, .1, 1, 1, 1)
                //             var mesh = new THREE.Mesh(geo, material)
                //             mesh.position.set(_x, _y, _z)
                //             group.add(mesh);
                //         }
                //     }
                // }

                var group = new THREE.Object3D();
                for (var _x = -3; _x <= 3; _x++) {
                    for (var _y = -3; _y <= 3; _y++) {
                        for (var _z = -3; _z <= 3; _z++) {
                            var geo = new THREE.BoxGeometry(Math.random()/10 *_y, Math.random()/10 *_z, Math.random()/10 *_x, 1, 1, 1)
                            var mesh = new THREE.Mesh(geo, material)
                            mesh.position.set(_x, _y, _z)
                            group.add(mesh);
                        }
                    }
                }

                // Background

                var cubeShader = THREE.ShaderLib['cube'];
                cubeShader.uniforms['tCube'].value = cubeMap;

                var skyBoxMaterial = new THREE.ShaderMaterial({
                    fragmentShader: cubeShader.fragmentShader,
                    vertexShader: cubeShader.vertexShader,
                    uniforms: cubeShader.uniforms,
                    depthWrite: false,
                    side: THREE.BackSide
                });

                var skyBox = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), skyBoxMaterial);
                scene.add(skyBox);

                // merge

                var geom = new THREE.Geometry()
                for (var i = 0; i < group.children.length; i++) {
                    group.children[i].updateMatrix();
                    geom.merge(group.children[i].geometry, group.children[i].matrix);
                }
                // add noise surface
                var mod = .3;
                for (var i = 0; i < geom.vertices.length; i++) {
                    var v = geom.vertices[i]
                    v.x += (Math.random() - .5) * mod
                    v.y += (Math.random() - .5) * mod
                    v.z += (Math.random() - .5) * mod
                }

                group = new THREE.Mesh(geom, material);
                scene.add(group)




                // light

                var light = new THREE.DirectionalLight(0xffffff);
                light.position.set(-1, 1.5, 0.5);
                scene.add(light);

                // events

                window.addEventListener('deviceorientation', setOrientationControls, true);
                window.addEventListener('resize', onWindowResize, false);

            }

            function animate() {

                requestAnimationFrame(animate);
                render();

            }

            function render() {

                controls.update();

                if (mobile) {
                    camera.position.set(0, 0, 0)
                    camera.translateZ(5);
                }
                renderer.render(scene, camera);

            }
