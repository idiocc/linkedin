/* yarn example/ */
import linkedin from '../src'

(async () => {
  const res = await linkedin({
    text: 'example',
  })
  console.log(res)
})()