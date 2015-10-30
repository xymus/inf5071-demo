vec2 center = vec2(200.0, 200.0);
float radius = 160.0;

// v2
vec4 color_a = vec4(1.0, 0.0, 0.0, 1.0);
vec4 color_b = vec4(0.0, 0.0, 1.0, 1.0);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 d2 = fragCoord.xy - center.xy;
    float d = (d2.x*d2.x + d2.y*d2.y) / (radius*radius); // alt
    //float d = sqrt(d2.x*d2.x + d2.y*d2.y) / radius;
    d = min(d, 1.0);
    float di = 1.0 - d;
    
    // v1
	//fragColor = vec4(0.0, d, di, 1.0);
    
    // v2
	fragColor = d*color_a + di*color_b;
}
