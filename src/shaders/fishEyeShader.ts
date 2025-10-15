const declaration = `
uniform float animAlpha;
uniform float fishEyeDelta;
uniform float distanceFactor;
uniform float sceneDistance;
uniform float zoomFactor;
uniform vec3 positionRef;
uniform float deformationFactor;

varying vec2 dxy;

float exponentialOut(float t) {
    return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

void main() {
`;

const implementation = `
#include <begin_vertex>
// Calculer la position mondiale du vertex SANS déformation d'abord
    vec3 worldPosOriginal = (modelMatrix * vec4(transformed, 1.0)).xyz;
    vec3 center = positionRef;
    
    // Calculer la distance en espace monde
    float dx = worldPosOriginal.x - center.x;
    float dy = worldPosOriginal.y - center.y;
    float distance = sqrt(dx*dx + dy*dy);
    float angle = atan(dy, dx);
    
    // Calculer le facteur de déformation
    float factor = fishEyeDelta + exponentialOut(distanceFactor * distance / sceneDistance * deformationFactor) * zoomFactor;
    
    // Extraire l'échelle de la modelMatrix
    float scaleX = length(vec3(modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]));
    float scaleY = length(vec3(modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]));
    
    // Créer le vecteur de déformation en espace monde
    float deformX = cos(angle) * factor * animAlpha;
    float deformY = sin(angle) * factor * animAlpha;
    
    // Convertir la déformation du monde à l'espace local en tenant compte de l'échelle
    vec3 deformWorld = vec3(deformX, deformY, 0.0);
    vec3 deformLocal = mat3(modelMatrix) * deformWorld;
    deformLocal.x /= (scaleX * scaleX);
    deformLocal.y /= (scaleY * scaleY);
    
    // Appliquer en espace local
    transformed += deformLocal;
    
    dxy.x = dx;
    dxy.y = dy;
// transformed = vec3(transformed.x + deformX * animAlpha, transformed.y + deformY * animAlpha, transformed.z);
`;

export { declaration, implementation };
