const float PI = 3.1415926535;

uniform float alpha;
uniform float fishEyeDelta;
uniform float distanceFactor;
uniform float sceneDistance;
uniform float zoomFactor;
uniform vec3 positionRef;

varying vec2 dxy;

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}
float exponentialOut(float t) {
return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}
void main() {
    //Get la world position
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vec3 center = positionRef;

    float dx = worldPos.x - center.x;
    float dy = worldPos.y - center.y;
    float distance = sqrt(dx*dx + dy*dy);
    // distance = sqrt(  distance * distance ) ;
    float angle = atan(dy, dx);
    float factor = fishEyeDelta  + exponentialOut( distanceFactor * distance / sceneDistance ) * zoomFactor;
    float xAlignement = cos(angle) * factor;// * exponentialOut( dy / 10. );
    float yAlignement = sin(angle) * factor;// * ( abs( dy / dx ) );

    dxy.x = dx;
    dxy.y = dy;

    vec3 newPos = vec3(position.x + xAlignement * alpha, position.y + yAlignement * alpha, position.z);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );

    // //Get la world position
    // vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    // vec3 center = positionRef;

    // float dx = worldPos.x - center.x;
    // float dy = worldPos.y - center.y;
    // float distance = sqrt(dx*dx + dy*dy);
    // // distance = sqrt(  distance * distance ) ;
    // float angle = atan(dy, dx);
    // float factor = fishEyeDelta  + exponentialOut( distanceFactor * distance / sceneDistance ) * zoomFactor;
    // float xAlignement = cos(angle) * factor;// * exponentialOut( dy / 10. );
    // float yAlignement = sin(angle) * factor;// * ( abs( dy / dx ) );

    // dxy.x = dx;
    // dxy.y = dy;
}