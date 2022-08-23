uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying float vAlpha;
uniform vec2 pixels;
attribute vec3 translate;
attribute float aRotate;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float PI = 3.141592653589793238;
void main() {
  // create random on this value + 0.33 to change in sprite
  vUv = (uv - vec2(0.5))/3. + vec2(0.5 + 0.33, 0.5);
  
  float depth = 5.;
  // original uv before 6image file using cloud2 nice
  // vUv = uv;
  vec3 newpos = position;
  
  newpos = rotate(newpos, vec3(0., 0., 1.), aRotate);
  newpos += translate;
  newpos.z = -mod(newpos.z - time*0.01, 5.);
  // calculate distance
  vPosition = newpos;
  vAlpha = smoothstep(-5. +3.5, -4. +3.5, newpos.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newpos, 1.0 );
}