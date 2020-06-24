(() => {
    window.addEventListener('DOMContentLoaded', () => {
		init();
		render();
	}, false);

	let scene;
	let camera;
	let renderer;

	let plane;
	let clock_cube;
	let sphere;
	let spotLight;

	let sec_group ;
    let min_group ;
    let hour_group;

	let trackball_controls;
	let clock;

	let grid;
	let axes;

	let gui;

	const clock_length = 16;
	const use_trackball_controls = true;

	let control_stats = new function(){
		this.axes_visible = false;
		this.light_x = -20;
		this.light_y =  20;
		this.light_z =  20;
	}

	function init_gui() {
		gui = new dat.GUI();
		gui.add(control_stats, "axes_visible");

		gui.add(control_stats, 'light_x', -30, 30);
		gui.add(control_stats, 'light_y', -30, 30);
		gui.add(control_stats, 'light_z', -30, 30);
	}

	function update_clock() {
        let date = new Date;
		let seconds = date.getSeconds();
		let minutes = date.getMinutes();
		let hours   = date.getHours();
		let secondsAngle = degree2radian(90 + 6 * seconds);
		let minutesAngle = degree2radian(90 + 6 * minutes );
		let hoursAngle   = degree2radian(90 + 30*hours + 0.5*minutes + 30.0/3600*seconds);
		sec_group.rotation.x = secondsAngle;
		min_group.rotation.x = minutesAngle;
		hour_group.rotation.x= hoursAngle;
	}

	function generate_whitebox(width, height, depth, x, y, z, colorcode){
		let box_geom = new THREE.BoxGeometry(width, height, depth);
		let box_material = new THREE.MeshLambertMaterial({color: colorcode});
		let box = new THREE.Mesh(box_geom, box_material);

		box.position.x = x - 0.5;
		box.position.y = 0;
		box.position.z = -width/2;
		box.rotation.y = degree2radian(90);
		box.castShadow = true;
		console.log(box.position);
		let group = new THREE.Group();
		group.add(box);
		return group;
	}

	function degree2radian(deg) {
		return deg / 360.0 * 2 * Math.PI;
	}

	function init_clock() {
        let cubeGeometry = new THREE.BoxGeometry(
			clock_length, clock_length, clock_length);
		//let cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
		let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide});
        clock_cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		scene.add(clock_cube);

		let clock_center = new THREE.Vector3( 
			clock_cube.position.x - clock_length/2,
			clock_cube.position.y,
			clock_cube.position.z  );

        let tempGeometry = new THREE.BoxGeometry(1, 1, 1);
        let temp_cube2 = new THREE.Mesh(tempGeometry, cubeMaterial);
		temp_cube2.position.x = clock_center.x;
		temp_cube2.position.y = clock_center.y;
		temp_cube2.position.z = clock_center.z;
		scene.add(temp_cube2);

		sec_group = generate_whitebox(clock_length / 2 * 0.8, 0.1, 0.1, 
			clock_center.x, clock_center.y, clock_center.z  , 0xff0000);
		min_group = generate_whitebox(clock_length / 2 * 0.7, 0.2, 0.2,  
			clock_center.x, clock_center.y, clock_center.z  , 0xffffff);
		hour_group= generate_whitebox(clock_length / 2 * 0.4, 0.4, 0.4,  
			clock_center.x, clock_center.y, clock_center.z  , 0xffffff);
		scene.add(sec_group);
		scene.add(min_group);
		scene.add(hour_group);
		console.log("clock done");
	}

	function init_light() {
		spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set( control_stats.light_x, control_stats.light_y, control_stats.light_z);
		scene.add(spotLight);
		console.log("light done");
	}

	function init_axis() {
		grid = new THREE.GridHelper(60, 10);
		scene.add(grid);
        axes = new THREE.AxisHelper(40);
        scene.add(axes);
		console.log("axis done");
	}

	function init_trackballcontrols() {
		trackball_controls = new THREE.TrackballControls(camera, renderer.domElement);
		clock = new THREE.Clock();
		trackball_controls.rotateSpeed = 2.0;
		trackball_controls.zoomSpeed = 2.0;
		trackball_controls.panSpeed = 2.0;
	}

	function init_plane() {
        let planeGeometry = new THREE.PlaneGeometry(120, 60);
        //let planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
		let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide});
        plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = -clock_length / 2;
        plane.position.z = 0;
        scene.add(plane);
	}

	function init_camera() {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = -40;
        camera.position.y = 40;
        camera.position.z = 40;
        camera.lookAt(scene.position);
	}
	function init_render() {
        renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(new THREE.Color(0x1d3156));
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("WebGL-output").appendChild(renderer.domElement);
	}

    function init() {
        scene = new THREE.Scene();
		init_camera();
		init_render();
		init_axis();
		init_plane();

		init_gui();
		if (use_trackball_controls == true) {
			init_trackballcontrols();
		}

        let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
        scene.add(sphere);

		init_clock();
		init_light();
    }

	function render() {
		//plane.visible = false;
		requestAnimationFrame(render);

		if (use_trackball_controls == true) {
			let delta = clock.getDelta();
			trackball_controls.update(delta);
		}
		apply_visible();
		update_light();
		update_shadow();
		update_clock();
        renderer.render(scene, camera);
	}

	function update_shadow() {
		clock_cube.castShadow = true;
		hour_group.castShadow= true;
		sec_group.castShadow = true;
		min_group.castShadow = true;

		spotLight.castShadow = true;

		clock_cube.receiveShadow = true;
		plane.receiveShadow = true;

        renderer.shadowMap.enabled = true;
	}

	function update_light() {
		spotLight.position.x = control_stats.light_x;
		spotLight.position.y = control_stats.light_y;
		spotLight.position.z = control_stats.light_z;
	}

	function apply_visible() {
		if (control_stats.axes_visible == true) {
			grid.visible = true;
			axes.visible = true;
		} else {
			grid.visible = false;
			axes.visible = false;
		}
	}

})();
