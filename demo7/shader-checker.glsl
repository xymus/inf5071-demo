float n_row = 8.0;
float n_col = 10.0;

vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
vec4 cell_color = vec4(0.4, 0.6, 0.4, 1.0);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 cell_dim = (iResolution / vec3(n_col/2.0, n_row/2.0, 0)).xy;
    vec2 pos_in_cell = mod(fragCoord, cell_dim);
    
    fragColor = cell_color;
    if (pos_in_cell.x < cell_dim.x/2.0 && pos_in_cell.y < cell_dim.y/2.0) {
    } else if (pos_in_cell.x < cell_dim.x/2.0) {
        fragColor = black;
    } else if (pos_in_cell.y < cell_dim.y/2.0) {
        fragColor = black;
    }
}
