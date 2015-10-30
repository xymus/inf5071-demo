float n_row = 8.0;
float n_col = 10.0;

float line_width = 5.0;
vec4 line_color = vec4(0.0, 0.0, 0.0, 1.0);
vec4 cell_color = vec4(0.4, 0.6, 0.4, 1.0);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 cell_dim = (iResolution / vec3(n_col, n_row, 0)).xy;
    vec2 pos_in_cell = mod(fragCoord, cell_dim);
    
    fragColor = cell_color;
    if (pos_in_cell.x < line_width) {
        fragColor = line_color;
    } else if (pos_in_cell.y < line_width) {
        fragColor = line_color;
    }
}
