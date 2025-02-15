# Assignment 3

### Objectives: 
To create a virtual world using textured cubes and explore it using a perspective camera.  



A first-person camera (the player) should start in a given position of a 32x32x4 voxel-based 3D world (which is made out of textured cubes). The user should be able to navigate in this world using the keyboard and/or mouse to move and rotate the camera. Your application is required to have the following features:

The world is fully created when the application starts.
Ground is created with a large plane (square), or the top of a flattened (scaled)  cube.
Walls are created with cubes.
Walls can have different heights in units (1 cube, 2 cubes, 3 cubes and 4 cubes).
The faces of the cube should be textured to make it look like a wall.
The sky is created with a very large blue  cube that is placed at the center of the world 
The world layout should be specified using a hardcoded javascript 2D array.
Each element of the array represents the height of the wall (0, 1, 2, 3 or 4) that will be placed at that location.
Camera can be moved using the keyboard.
W moves camera forward.
A moves camera to the left.
S moves camera backwards
D moves camera to the right.
Q turn camera left
E turn camera right
Additional requirements without helper videos:

Camera can be rotated with the mouse. 
Add multiple textures to make your world more interesting.
Simple Minecraft: add and delete blocks in front of you. 
Add your animal(s) to your world
Change your ground plane from a flat plane to a terrain map OR get OBJ loader working
Add some sort of simple story or game to your world