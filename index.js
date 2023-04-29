import { Hono } from "hono"

const app = new Hono()

app.get("/user/:username/views", async (c) => {
  const username = c.req.param('username')
  c.status(200)

  const kvKey = `user:${username}:stats:profile-views`
  const views = await c.env.GithubViewsKV.get(kvKey)
  const newViews = views ? parseInt(views) + 1 : 1

  try {
    await c.env.GithubViewsKV.put(kvKey, newViews)
  } catch (error) {
    console.log("Error updating views count", error)
  }

  const viewDigitsCount = `${newViews}`.length
  const svgWidth = viewDigitsCount * 8 + 110

  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 'no-cache must-revalidate')

  return c.body(`<svg width="${svgWidth}" height="24" xmlns="http://www.w3.org/2000/svg">
    <style>
      .text{
        font-size: 14px;
        font-weight: 500;
        leading: 24px;
      }
    </style>
    <rect width="100%" height="100%" fill="#f78d58"/>
    <text x="10" y="18" class=".text" fill="black">Profile Views</text>
    <text x="102" y="18" class=".text" fill="black">${newViews}</text>
  </svg>`)
})

export default app