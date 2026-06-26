# ---------- IMPORTING TOOLS ----------
# random helps us generate random numbers (noise & data points)
import random
# math gives us mathematical functions (we use it indirectly here)
import math

# ---------- THE "HIDDEN" TRUTH ----------
# These are the REAL values our model will try to discover.
# Think of them as a secret answer sheet — our model doesn't
# know these, but it should get close by learning from data.
TRUE_W = 3.0      # The real slope (how steep the line is)
TRUE_B = 7.0      # The real y-intercept (where the line crosses the y-axis)
N_SAMPLES = 1000  # How many data points we'll make

# ---------- CREATING SYNTHETIC DATA ----------
# X values: 1000 random numbers between 0 and 10
X = [random.uniform(0, 10) for _ in range(N_SAMPLES)]

# Y values: follow the formula  y = 3x + 7  but with a little
# random noise added (gauss = Gaussian / normal noise).
# This makes it look like real-world messy data instead of a perfect line.
Y = [TRUE_W * x + TRUE_B + random.gauss(0, 2.0) for x in X]

# Quick peek at the data we just created
print(f"Generated {N_SAMPLES} samples")
print(f"True relationship: y = {TRUE_W}x + {TRUE_B} (+noise)")
print(f"First 5 points: {[(round(X[i], 2), round(Y[i], 2)) for i in range(5)]}")


# ============================================================
#  CLASS: LinearRegression
#  What it does: Learns a straight line that best fits our data
#  Math behind it:  y = w * x + b
#    - w = weight (slope)  → how steep the line is
#    - b = bias (intercept) → where the line crosses the y-axis
# ============================================================
class LinearRegression:

    # ----- CONSTRUCTOR -----
    # Sets up the model with initial values.
    # learning_rate controls how big each adjustment step is.
    def __init__(self, learning_rate=0.01):
        self.w = 0.0                # Start with slope = 0
        self.b = 0.0                # Start with intercept = 0
        self.lr = learning_rate     # Step size for learning
        self.cost_history = []      # Track cost over time (to see improvement)

    # ----- PREDICT -----
    # Given X values, compute:  y = w*x + b  for each one
    def predict(self, X):
        return [self.w * x + self.b for x in X]

    # ----- COMPUTE COST (Mean Squared Error) -----
    # Measures how BAD our current line is.
    # For each point: (predicted - actual)^2   → penalizes big mistakes more.
    # Then we average all those squared errors.
    # Lower cost = better fit.
    def compute_cost(self, X, Y):
        predictions = self.predict(X)
        n = len(Y)
        cost = (1 / n) * sum((pred - actual) ** 2 for pred, actual in zip(predictions, Y))
        return cost

    # ----- COMPUTE GRADIENT -----
    # Tells us which direction to adjust w and b to reduce the cost.
    # dw = partial derivative with respect to w (slope direction)
    # db = partial derivative with respect to b (intercept direction)
    # These are the "slope of the cost function" at the current w and b.
    def compute_gradient(self, X, Y):
        predictions = self.predict(X)
        n = len(Y)
        dw = (2 / n) * sum((pred - actual) * x for pred, actual, x in zip(predictions, Y, X))
        db = (2 / n) * sum((pred - actual) for pred, actual in zip(predictions, Y))
        return dw, db

    # ----- FIT (TRAIN THE MODEL) -----
    # This is where the actual learning happens.
    # For each epoch (iteration):
    #   1. Calculate the gradient (direction of steepest error)
    #   2. Take a small step DOWNHILL — update w and b opposite to the gradient
    #   3. Record the cost so we can watch the model improve
    def fit(self, X, Y, epochs=1000, print_every=200):
        for epoch in range(epochs):
            dw, db = self.compute_gradient(X, Y)

            # Gradient descent step: move w and b in the opposite
            # direction of the gradient to reduce error.
            self.w -= self.lr * dw
            self.b -= self.lr * db

            cost = self.compute_cost(X, Y)
            self.cost_history.append(cost)

            # Print progress every few epochs so we can see it improving
            if epoch % print_every == 0:
                print(f"Epoch {epoch:4d} | Cost: {cost:.4f} | w: {self.w:.4f} | b: {self.b:.4f}")

        return self  # Return the trained model (useful for chaining)

    # ----- R-SQUARED (GOODNESS OF FIT) -----
    # Measures how well our line explains the data.
    # 1.0 = perfect fit   0.0 = the line is useless
    # It compares our model's errors vs. just guessing the average.
    def r_squared(self, X, Y):
        predictions = self.predict(X)
        y_mean = sum(Y) / len(Y)

        # ss_res = sum of squared residuals (our model's mistakes)
        ss_res = sum((actual - pred) ** 2 for actual, pred in zip(Y, predictions))
        # ss_total = total variance in the data (how spread out Y is)
        ss_total = sum((actual - y_mean) ** 2 for actual in Y)

        # R² = 1 - (unexplained variance / total variance)
        return 1 - (ss_res / ss_total)


# ============================================================
#  MAIN — Run the whole thing
# ============================================================
print("\n--------- Training Linear Regression (Gradient Descent) ---------")

# Create a LinearRegression model with a small learning rate
model = LinearRegression(learning_rate=0.005)

# Train it for 2000 iterations, printing progress every 200
model.fit(X, Y, epochs=2000, print_every=200)

# Compare what the model learned vs. the true values
print(f"\n> Learned: y = {model.w:.4f}x + {model.b:.4f}")
print(f"> True:    y = {TRUE_W}x + {TRUE_B}")
print(f"> R-squared: {model.r_squared(X, Y):.4f}  (1.0 = perfect prediction)")

