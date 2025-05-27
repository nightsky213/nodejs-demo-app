// Simple test to simulate CI test phase
console.log("Running dummy test...");
if (1 + 1 !== 2) {
  throw new Error("Math is broken!");
}
console.log("All tests passed!");

