           var camera, scene, renderer;
            var mobile = false;
            var material, cubeShader

            var cubes = []
            var group
            var object
            var verticesOriginal

            var time = 0;

            init();
            setup();
            render();

            function init() {

                // renderer

                renderer = new THREE.WebGLRenderer({antialias: true});
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);

                // scene

                scene = new THREE.Scene();

                // camera

                camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, .1, 1000);
                camera.position.set(0, 0, 3);
                camera.focalLength = camera.position.distanceTo(scene.position);
                scene.add(camera)

                // controls

                controls = new THREE.OrbitControls(camera);
                controls.autoRotate = true;
                //controls.maxDistance=1

                if (WEBVR.isAvailable() === true) {
                    controls = new THREE.VRControls(camera);
                    controls.standing = false;

                    renderer = new THREE.VREffect(renderer);
                    document.body.appendChild(WEBVR.getButton(renderer));
                }

                // events

                window.addEventListener('deviceorientation', setOrientationControls, true);
                window.addEventListener('resize', onWindowResize, false);
                window.addEventListener('click', click, false);

            }

            function click() {

                // change bg

                var cubeMap = getCubeMap(Math.floor(Math.random() * 4))
                cubeShader.uniforms['tCube'].value = cubeMap;
                material.envMap = cubeMap

                // animate cubes

                var center = new THREE.Vector3();
                for (var i = 0; i < group.children.length; i++) {
                    var newPosition = new THREE.Vector3((Math.random() - .5) * 5, (Math.random() - .5) * 5, (Math.random() - .5) * 5)

                    while (newPosition.distanceTo(center) < 2) {
                        newPosition = new THREE.Vector3((Math.random() - .5) * 5, (Math.random() - .5) * 5, (Math.random() - .5) * 5)
                    }

                    var c = group.children[i];
                    // c.position.x += Math.sin(time + i % 3) / 100
                    //  c.position.y += Math.sin(time + i % 3 + 1) / 100
                    //  c.position.z += Math.sin(time + i % 3 + 2) / 100
                    TweenMax.to(c.position, 1, {
                        delay: Math.random() * .3,
                        x: newPosition.x,
                        y: newPosition.y,
                        z: newPosition.z,
                        ease: Back.easeOut
                    })
                }
            }

            function setup() {

                var cubeMap = getCubeMap(1)


                // skybox

                cubeShader = THREE.ShaderLib['cube'];
                cubeShader.uniforms['tCube'].value = cubeMap;

                var skyBoxMaterial = new THREE.ShaderMaterial({
                    fragmentShader: cubeShader.fragmentShader,
                    vertexShader: cubeShader.vertexShader,
                    uniforms: cubeShader.uniforms,
                    depthWrite: false,
                    side: THREE.BackSide
                });

                var skyBox = new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100), skyBoxMaterial);

                scene.add(skyBox);

                // central object

                var texture = new THREE.TextureLoader().load("assets/textures/pattern-3.jpg");
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);

                // var geometry = new THREE.IcosahedronGeometry(1, 1);
                var geometry = new THREE.SphereGeometry( 1, 70, 70 );
                // var geometry = new THREE.IcosahedronGeometry( 1, 0 );
                verticesOriginal = geometry.clone().vertices;
                material = new THREE.MeshBasicMaterial({
                    bumpScale: .1, 
                    alphaMap: texture, 
                    transparent: true, 
                    //side:THREE.DoubleSide
                    shading: THREE.FlatShading, 
                    envMap: cubeMap, 
                    wireframe: false,
                    //bumpMap: texture, 
                    //map:texture
                });
                object = new THREE.Mesh(geometry, material);
                scene.add(object);

                // cubes

                group = new THREE.Object3D();
                // var geo = new THREE.BoxGeometry(.1, .1, .1, 1, 1, 1)
                var geo = new THREE.IcosahedronGeometry( .1, 0 );
                for (var i=0;i<geo.vertices.length;i++){
                    geo.vertices[i].x+=(Math.random()-.5)/10
                    geo.vertices[i].y+=(Math.random()-.5)/10
                    geo.vertices[i].z+=(Math.random()-.5)/10
                }
                for (var _x = -2; _x <= 2; _x++) {
                    for (var _y = -2; _y <= 2; _y++) {
                        for (var _z = -2; _z <= 2; _z++) {
                            var mesh = new THREE.Mesh(geo, material)
                            mesh.position.set(_x, _y, _z)
                            mesh.rotation.x = Math.random()
                            mesh.rotation.y = Math.random()
                            mesh.rotation.z = Math.random()
                            mesh.scale.x = 1
                            mesh.scale.y = 1
                            mesh.scale.z = 1
                            group.add(mesh);
                            cubes.push(mesh)
                        }
                    }
                }
                scene.add(group)

                // merge

                /*var geom = new THREE.Geometry()
                 for (var i = 0; i < group.children.length; i++) {
                 group.children[i].updateMatrix();
                 geom.merge(group.children[i].geometry, group.children[i].matrix);
                 }
                 group = new THREE.Mesh(geom, material);
                 scene.add(group)*/

                // light

                var light = new THREE.DirectionalLight(0xffffff);
                light.position.set(-1, 1.5, 0.5);
                //var light = new THREE.PointLight(0xFFFFFF,1,10)
                //light.position.x=-1
                camera.add(light);

                //var ambient = new THREE.AmbientLight(0x666666)
                //scene.add(ambient)
            }

            function render() {
                requestAnimationFrame(render);

                controls.update();

                time += .01
                object.rotation.x += .01
                object.rotation.y += .01

                var v = object.geometry.vertices
                for (var i = 0; i < v.length; i++) {
                    if (Math.random() < .01) {
                        TweenMax.to(v[i], .1, {
                            x: verticesOriginal[i].x * (2 + Math.random() * .2),
                            y: verticesOriginal[i].y * (2 + Math.random() * .2),
                            z: verticesOriginal[i].z * (2 + Math.random() * .2)
                        })
                    } else {
                        TweenMax.to(v[i], 1, {
                            x: verticesOriginal[i].x,
                            y: verticesOriginal[i].y,
                            z: verticesOriginal[i].z
                        })
                    }
                }
                object.geometry.verticesNeedUpdate = true;

                
                if (mobile) {
                    camera.position.set(0, 0, 0)
                    camera.translateZ(5);
                }
                renderer.render(scene, camera);

            }