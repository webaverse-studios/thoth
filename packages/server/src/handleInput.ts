//handles the input from a client according to a selected agent and responds
export async function handleInput(
  message: any,
  speaker: any,
  agent: any,
  res: any,
  clientName: any,
  channelId: any
) {
  const text = "echo " + message
  if (res) res.status(200).send(JSON.stringify({ result: text }))
  return text
}
