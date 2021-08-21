let myfollowers = ["Tina", "Brad", "Josh", "Frank"];
let mygirlfriendsfollowers = ["Brad", "Josh", "Mike", "Sindy"];
let mutualfollowers = [];

for (let i = 0; i < myfollowers; i++) {
  for (let m = 0; m < mygirlfriendsfollowers; m++) {
    if (myfollowers[i] === mygirlfriendsfollowers[m]) {
      return mutualfollowers.push(myfollowers[i]);
    }
  }
}

console.log(mutualfollowers);
