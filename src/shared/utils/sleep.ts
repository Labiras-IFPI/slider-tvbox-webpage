export async function sleep(ms: number, myFuction: () => void) {
  await new Promise((resolve) => setTimeout(() => resolve(myFuction()), ms));
}
