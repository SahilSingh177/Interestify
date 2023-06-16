const colours=["red","orange","yellow","teal","cyan","purple","pink"];
export const getRandomColour = ()=>{
  const randomIndex = Math.floor(Math.random()*colours.length);
  return colours[randomIndex];
}