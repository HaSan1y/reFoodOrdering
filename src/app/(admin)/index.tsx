// index redirect to /menu/ 
import { Redirect } from "expo-router";

export default function TabIndex() {
   return <Redirect href={'/(admin)/menu/'} />
}
// Compare this snippet from FoodOrdering/src/app/%28tabs%29/two.tsx: