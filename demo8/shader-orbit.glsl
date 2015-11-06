// Orbit config
vec2 center = vec2(132.0, 132.0);
float orbit_radius = 120.0;
float orbit_line = 2.0;
vec4 orbit_color = vec4(0.0, 0.0, 1.0, 1.0);

// Satellite config
float speed = 3.14159/4.0;
float satellite_radius = 10.0;
vec4 satellite_color = vec4(1.0, 0.0, 0.0, 1.0);

// Background
vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

// Distance from `fragCoord` to `center`
float distToPoint(vec2 fragCoord, vec2 center)
{
    vec2 d2 = fragCoord.xy - center.xy;
    return sqrt(d2.x*d2.x + d2.y*d2.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Orbit?
    float dist = distToPoint(fragCoord, center);
    
    float dist_to_orbit = orbit_radius - dist;
 	float dto_prop = abs(dist_to_orbit) / orbit_line;
    dto_prop = min(dto_prop, 1.0);
    
    fragColor = dto_prop*white + (1.0-dto_prop)*orbit_color;
    
    // Satellite?
    float satellite_angle = iGlobalTime * speed;
    vec2 satellite_center = vec2(
        center.x + cos(satellite_angle)*orbit_radius,
        center.y + sin(satellite_angle)*orbit_radius);
    
    dist = distToPoint(fragCoord, satellite_center);
    if (dist < satellite_radius)
        fragColor = satellite_color;
}
