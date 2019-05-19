```info 
name: Diophantine equations
```

# The Problem

I have a bowl on my shelf. Every time I go into my room, I like to
empty my pockets so I can sit comfortably, and any change I still have
rattling around in them, I'll place into this bowl. I don't take
pennies in change, so it's only quarters, nickels, and dimes. Today, I
need money, and the bowl is looking pretty full. However, the last
thing I want is to count all the coins to tally up how much I have.

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
