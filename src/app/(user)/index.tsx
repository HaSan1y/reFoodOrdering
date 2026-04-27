// index redirect to /menu/ 
import { Redirect } from "expo-router";

export default function TabIndex() {
   return <Redirect href={'/(user)/menu/'} />
}
// Compare this snippet from FoodOrdering/src/app/%28tabs%29/two.tsx: