# Project Images

Project images are stored in this directory and referenced by `public/data/projects.json`:

- `cannaclub.png`
- `marketresearch.png`
- `lemonade.png`
- `chipotle.png`
- `lab.png`

Keep the filename and extension in each project entry identical to the asset's exact case. The production Docker image runs on Linux, where `/images/example.PNG` and `/images/example.png` are different paths.

After adding or replacing images, rebuild and restart the container:

```sh
docker compose up --build -d
```
