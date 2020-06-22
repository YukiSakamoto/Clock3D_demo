(() => {
    window.addEventListener('DOMContentLoaded', () => {
		// 初期化
		init();
    }, false);
	
	let camera;
	let scene;
	let renderer;

	let plane;
	let light;


	let sec_group 
    let min_group 
    let hour_group

	let ticks = [];

	let Light_Default_PARAM  = {
		lightDefaultX: -20,
        lightDefaultY:  30,
        lightDefaultZ:  -5,
	};

	function init_camera() {
		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.x = -0.005;
		camera.position.y = 50.5;
		camera.position.z = 0;
        camera.lookAt(scene.position);
		console.log("camera done");
	}

	function init_renderer() {
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(new THREE.Color(0x1d3156));
		renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("WebGL-output").appendChild(renderer.domElement);
		console.log("renderer done");
	}

	function init_plane() {
		let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
		let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide});
		plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.rotation.x = -0.5 * Math.PI;
		plane.position.y = -0.1;
		scene.add(plane);
		console.log("plane done");
	}

	function generate_whitebox(width, height, depth, x, y, z, colorcode){
		let box_geom = new THREE.BoxGeometry(width, height, depth);
		let box_material = new THREE.MeshLambertMaterial({color: colorcode});
		let box = new THREE.Mesh(box_geom, box_material);
		box.position.x = x;
		box.position.y = y;
		box.position.z = z;
		box.castShadow = true;
		let group = new THREE.Group();
		group.add(box);
		return group;
	}

	function init_clock() {
		sec_group = generate_whitebox(15.0, 0.1, 0.1,  4.0, 1.0, 0.0, 0xff0000);
		min_group = generate_whitebox(15.0, 0.2, 0.2,  4.0, 1.0, 0.0, 0xffffff);
		hour_group= generate_whitebox( 7.0, 0.4, 0.4,  2.5, 1.0, 0.0, 0xffffff);
		scene.add(sec_group);
		scene.add(min_group);
		scene.add(hour_group);
		console.log("clock done");
	}

	function init_light() {
		spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set(
			Light_Default_PARAM.lightDefaultX, 
			Light_Default_PARAM.lightDefaultY, 
			Light_Default_PARAM.lightDefaultZ);
		scene.add(spotLight);
		console.log("light done");
	}

	function init_ticks() {
		let radius = 16;
		for(let i = 0; i < 12; i++) {
			let tick = new THREE.Mesh(
				new THREE.CylinderGeometry(0.5, 0.5, 0.4),
				new THREE.MeshLambertMaterial({color: 0xffffff})
			);
			tick.position.x = radius * Math.cos( degree2radian(30.0 * i) );
			tick.position.z = radius * Math.sin( degree2radian(30.0 * i) );
			tick.position.y = 1.0;
			tick.castShadow = true;
			ticks.push(tick);
			scene.add(tick);
		}
		console.log(ticks);
	}

	function init() {
		scene  = new THREE.Scene();
		init_camera();
		init_renderer();
		init_plane();
		init_ticks();
		init_clock();
		init_light();

		render();
	}

	function degree2radian(deg) {
		return deg / 360.0 * 2 * Math.PI;
	}
	function update_clock() {
        let date = new Date;
		let seconds = date.getSeconds();
		let minutes = date.getMinutes();
		let hours   = date.getHours();
		let secondsAngle = -degree2radian(6 * seconds);
		let minutesAngle = -degree2radian(6 * minutes );
		let hoursAngle   = -degree2radian(30*hours + 0.5*minutes + 30.0/3600*seconds);
		sec_group.rotation.y = secondsAngle;
		min_group.rotation.y = minutesAngle;
		hour_group.rotation.y= hoursAngle;
	}

	function render() {
		requestAnimationFrame(render);

		update_clock();
		renderer.render(scene, camera);
	}

})();
