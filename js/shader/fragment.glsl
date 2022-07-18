uniform float time;
uniform float progress;
uniform sampler2D t1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
varying float vAlpha;
void main()	{
	// pink
  // vec3 color = vec3(0.835, 0.000, 0.564);
	// dark blue
	vec3 color = vec3(0., 0.000, 139.);
	
	vec4 map = texture2D(t1, vUv);
  
	if(map.r < 0.01) discard;

	// vec3 final = color*map.r;
	vec3 final = mix(vec3(1.), color, 1. - map.r);

	float opacity = smoothstep(0.5, 1., length(vPosition.xy));
	gl_FragColor = vec4(vUv, 0.0, vAlpha);
	// gl_FragColor = map;
	gl_FragColor = vec4(final, vAlpha*opacity*0.3);
	// gl_FragColor.a = vAlpha*opacity;
	// gl_FragColor = vec4(opacity);
}