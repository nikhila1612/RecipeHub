import express from "express";
import axios from "axios";

const app = express();
const port = 3000;


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
    const content = "Discover Your Culinary Adventure: Welcome to Recipe Hub!"
    const home="Latest Meals"
    res.render("index", { image: null, instructions: null,foodName: null, content, home});
});

// Handle form submission
app.post("/", async (req, res) => {
    try {
        const itemName = req.body.item;
       
        // Fetch data from MealDB API
        const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${itemName}`
        );
        const meal = response.data.meals[0];
       
        if (!meal) {
            return res.render("index", { image: null, instructions: null,foodName:null, ingredients:null,content:"Sorry, No Meal Matches That Name! Feel Free to Try Something Else!",home:null});
        }

        const image = meal.strMealThumb;
        const instructions = meal.strInstructions;
        const foodName = meal.strMeal; 
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            } else {
                break;
            }
        }
        res.render("index", { image, instructions,foodName,ingredients,content:null,home:null });
    } catch (error) {
        console.error("Error fetching meal:", error);
        res.render("index", { image: null, instructions: null, foodName: null, ingredients:null,content:"Sorry, No Meal Matches That Name! Feel Free to Try Something Else!",home:null});
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});