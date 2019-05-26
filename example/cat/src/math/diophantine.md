```info 
name: Diophantine equations
```

# The Problem

I have a bowl on my shelf. Every time I go into my room, I like to
empty my pockets so I can sit comfortably, and so any change I still
have rattling around I'll place into this bowl. I don't take pennies
in change, so it's only quarters, nickels, and dimes. Today, I need
money, and the bowl is looking pretty full. However, the last thing I
want is to count all the coins to tally up how much I have.

In a moment of lazy genius, I realise: I can weigh the coins! But if I
find I have 1kg of coins or something, how much money is that? A
quarter weighs 5.67 grams, a nickel 5 grams, and a dime 2.268 grams,
so how can I tell I just have 200 nickels or just around 176
quarters or something in between?

This is clearly a problem if I only know I have "around" 1kg, but if I
know I have exactly 1.00kg of coins, then I actually know I cannot
make that in quarters because 176 quarters would weigh 997.92g and 177
quarters would weigh 1003.59g. So in fact, if we had this exact
measurement, we could deduce that we actually had 200 nickels, also
known as 4 dollars.

Similarly, if I found out that I had exactly 15.206g of coins, then
the only way to make this out of the coins would be 1 quarter, 1
nickel, and 2 dimes.

What if I discovered I had 7.5g of coins? Well, you can try it, and
there's no way to make 7.5g out of the three weights we have, so I'd
know something different from all three was in the mix (probably a
stray penny, since those weigh 2.5g each).

So in fact, I shouldn't be able to see just any weight on the scale,
but only those that are valid combinations of weights of coins.

So maybe if I know the exact weight precisely enough, I can count my
money exactly with a simple algorithm!

Let's say for concreteness that I weigh my coins and discover that I
have exactly 997.67 grams.

# The Simplification

Now, this problem seems kind of hard. And when we have a hard problem,
the first instinct is to find an easier problem that still has the
same essential features while removing a lot of the things that make
the specific problem challenging.

So in this case, there are three variables: number of quarters, of
nickels, and of dimes. If we shrink it down to one variable, that's
too simple, but two variables retains the feature of having to balance
to precise quantities. 

Further, in the real problem, the weights are messy decimals. If we
could make them simple integers, that would be nicer. But how simple?
If we said they both weighed 1g, that would be again too easy. If we
made them weigh something like 7 and 12 grams apiece, that seems hard
enough. 

So we'll make a simplified fake problem where we only have two kinds
of coins, say dollar and half-dollar coins, and that these (in our
fake world) weigh 12 and 7 grams, respectively.  And let's say again
we had 1kg of coins. If $x$ is the number of dollar coins and $y$ the
number of half-dollar coins, then we are looking to solve the equation:

$12x + 7y = 1000$

But for _integer_ values of $x$ and $y$. So $x = 0$ and $y =
fraction(1000,7)$ doesn't count, since we can't easily have
$fraction(1000,7)$ coins.

Fiddle around with numbers for a bit and see if you can make a
solution.

# The Further Simplification

In mathematics, if a problem is still too hard, a good strategy is
often to make things zero until they become easy. This problem is hard
because it has two variables, $x$ and $y$. 

But if 7 were zero, then the problem would become much simpler: $12x =
1000$. Further, if 7 were zero, then 12 would be the same as 5 (since
$12 = 5 + 7$ and $7 = 0$), and better still, 1000 would be the same as
$1000-7$, which would be the same as $1000-7-7$, and so on until we
get to (if you subtract enough 7s from 1000, you eventually get down
to 6).

So really, our problem is just $5x = 6$. And we don't even have to get
the two sides actually equal, just to make sure that the only
difference between them is a multiple of 7.

This feels like we can just do it: Let's try: 

* $x = 1$. Does $5 * 1 = 6$? The difference between the two sides is
1, which is not a multiple of 7

* $x = 2$. Does $5 * 2 = 6$? The difference between the two sides is
3, which is not a multiple of 7

* $x = 3$. Does $5 * 3 = 6$? The difference between the two sides is
9, which is not a multiple of 7

* $x = 4$. Does $5 * 4 = 6$? The difference between the two sides is
14, which is a multiple of 7. Aha!

OK, so if x = 4, then $5x$ and $6$ differ by a multiple of 7.

But if we're ignoring multiples of 7, this is the same as saying $12x$
and $1000$ differ by multiples of 7.

And indeed, $12*4 = 1000 - 7*136$. So we've done it: 4 dollar coins
and 136 half-dollar coins will weigh exactly 1kg. 

# The Ambiguity

But wait--if I have exactly 1kg of coins, does that necessary mean I
have 4 dollar coins and 136 half-dollars? Are there other
possibilities that would also weigh the same?

If you think of it, adding 7 dollar coins will add $12*7$ grams, while
removing 12 half-dollar coins will remove $7*12$ grams.

So we can keep the same weight by adding groups of 7 dollars and
taking away groups of 12 half-dollars. 

This gives us a whole range of different possibilities: 

* 4 dollars and 136 half-dollars
* 11 dollars and 124 half-dollars
* 18 dollars and 112 half-dollars
* 25 dollars and 100 half-dollars
* 32 dollars and 88 half-dollars
* 39 dollars and 76 half-dollars
* 46 dollars and 64 half-dollars
* 53 dollars and 52 half-dollars
* 60 dollars and 40 half-dollars
* 67 dollars and 28 half-dollars
* 74 dollars and 16 half-dollars
* 81 dollars and 4 half-dollars

And now we can't take away any more groups of 12 half-dollars, so
these are all the possibilities. 

In conclusion, for the simpler problem, we can't actually tell how
many coins we have just by weighing them, but we can reduce it to a
small set of possible combinations of numbers.

# Sourcing the Ambiguity

So the question becomes: What caused there to be more than one answer?

The problem was that we could remove either 7 dollars (and add 12
half-dollars) or remove 12 half-dollars (and add 7 dollars) from our
answer and it would still weigh the same. 

Now imagine our coins weighed instead 80 grams. We could do the same
thing as before and discover that 2 dollars and 8 half-dollars
works. But this time, we cannot adjust the quantities at all, since if
we add 7 dollars, we have to take away 12 half-dollars, but we only
have 8 half-dollars. And likewise, if we add 12 half-dollars, we'd
have to take away 7 dollars but we only have 2.

So if the number of dollars is guaranteed to be less than 7 and the
number of half-dollars guaranteed to be less than 12, then we'll be
stuck with only one answer.

One situation where this is guaranteed (though not the only one) is if
the total weight is less than $7*12$ grams. As now having 7 dollars or
12 half-dollars alone would exceed our total weight, so we definitely
can't have either.

So the weight above which we start to get possible ambiguities is
$12*7$, or $84$, grams.

# Returning to the original problem

Phrasing the original problem in this light, if we have $Q$ quarters,
$N$ nickels, and $D$ dimes, all weighing then we have: 

$5.67 Q + 5 N + 2.268 D = 997.67$

This looks nastier because of all the decimals, but we can easily make
everything integers by just multiplying the whole equation by 1000:

$5670 Q + 5000 N + 2268 D = 997670$

So what are the problems now: The numbers are bigger, but that just
means things will take longer and isn't a theoretical issue. We also
have three variables instead of 2, which we actually haven't
considered yet. The numbers also share some common factors between the
numbers this time, which might require more care.
