# Assignment 4 - Lighting

### Objectives
To have a single point light that illuminates your objects.

### Requirements
Your application is required to have the following features:

- A Cube - The most basic object that you should be able to create by now.
- A sphere in your world. Why? Its easier to tell if lighting is working correctly on spheres.
- A single point light that changes location, possibly spinning around your world, or just moving back and forth.
- A way to tell where the light is. Easiest is to just render a cube at the light location.
- Some method of moving the camera around the objects, either rotation slider or keyboard
- Each object (ground, walls, animal, and spheres) of the world is illuminated using a Phong Shader
- Phong Shader models a combination of ambient, diffuse and specular lighting.
- - Specular and Diffuse lighting calculations require the normal of the vertices. So you will have to calculate the normal of each vertex and pass this as input to the shader.
- A button to turn lighting on/off
- A button to turn normal visualization on/off
- Additional requirements that do not have helper videos
  - Implement a spot light which focuses light in a particular direction (in addition to the first light you had), be able to turn on/off the lights individually.
  - Your lighting is working either with your animal or with your world from A2 or A3