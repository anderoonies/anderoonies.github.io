---
title: AndyBot
layout: page
photo_url: /projects/andybot/andybot.png
excerpt: A well-intentioned Twitter bot
---


<img src="/projects/andybot/andybot.png" width="35%" align="right">

# AndyBot

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">what daddy likes!!</p>&mdash; AndyBot (@ANDO_3000) <a href="https://twitter.com/ANDO_3000/status/699254362879758336">February 15, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

AndyBot's a well-intentioned Twitter bot that uses a Markov chain to generate tweets based off of my own. He's developed his own sort of personality, a slightly confused but [very eager](https://twitter.com/ANDO_3000/status/698891974590492672) simplification of myself. His tweets verge on the [philosophical](https://twitter.com/ANDO_3000/status/688437906969616384) or just [goofy](https://twitter.com/ANDO_3000/status/650717034972581888).

## How

The process is scraping my own tweets, generation the Markov chain, then hitting the Twitter API with it.

Fetching is pretty crude and simple, then the tweets are constructed into a dictionary of trigrams.

{% highlight python %}
def generate_triples(self):
  if len(self.words) < 3:
    return

  for i in range(len(self.words) - 2):
    yield (self.words[i], self.words[i+1], self.words[i+2])

def populate(self):
  # populate the dictionary with keys of two words, values of resulting words
  for word1, word2, word3 in self.generate_triples():
    key = (word1, word2)
    if key in self.dict:
      self.dict[key].append(word3)
    else:
      self.dict[key] = [word3]
{% endhighlight %}

This generates a mapping of tuples of two words to candidates of words that could follow. That looks something like this:

{% highlight python %}
('i', 'figure'): ['the'],
('quartet', 'sounds'): ['like'],
('aid', 'check'): ['them'],
('banjo', 'so'): ['your'],
('no', 'hands'): ['thinking'],
('takes', 'himself'): ['way'],
('you', 'die'): ['you', 'in', 'all']
{% endhighlight %}

The generation of tweets is pretty simple:

{% highlight python %}
word1, word2 = word2, random.choice(self.dict[(word1, word2)])
{% endhighlight %}

The next word word is chosen based off of the two most recent words. The process repeats until a natural ending point is reached or the bot runs out of its 140 characters. Here's an example of what that chaining looks like:

{% highlight python %}
to, release => ['my']
release, my => ['captive']
my, captive => ['elephants']
captive, elephants => ['i']
elephants, i => ['think']
i, think => ["you'll", 'about', 'everyone', "it's", 'i', 'i', 'i', 'they', \
             "i'll", "'impish'", "i've", 'the', "that's", 'northwestern']
think, they => ['do', 'were']
they, were => ['about', '14', 'doing', 'going']
were, doing => ['i']
doing, i => ['still']
i, still => ['havent', 'dont', 'cry']
still, havent => ['been']
havent, been => ['contacted']
been, contacted => ['about']
contacted, about => ['the']
about, the => ['nut', 'property', 'plot', 'danger', 'show?', 'expendables', \
               'war', 'ridiculous', 'heisman', 'salem', 'smell', 'smell.']
the, smell => ['I']
smell, I => ['think']
I, think => ["we're", 'I', 'I', 'someone', 'someone', 'someone']
think, I => ['just', 'just']
I, just => ['spent', 'drive', 'nailed', 'exhausted', 'invent', 'dropped', \
            'listened', 'squirted', 'poured', 'watched', 'vacuumed.', \
            'realized', 'listened', 'won', 'kept', 'pound', 'ate']
just, drive => ['past']
drive, past => ['Rivers']
past, Rivers => ['Cuomo?']
Rivers, Cuomo? => ['huuu']
--------------------------
to release my captive elephants i think they were doing i still havent been \
contacted about the smell I think I just drive past Rivers
{% endhighlight %}

You can see the scenarios where the tuple of words is too unique and only has one candidate. I must not tweet about elephants much, but I do tweet about things I just did a lot.

## Summary

Despite his good intentions, AndyBot makes mistakes. I haven't taught him not to tweet at people. A few times he's @ mentioned people I haven't talked in years and in other cases confused customer support people.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/ANDO_3000">@ANDO_3000</a> Please clarify your tweet. ^CP</p>&mdash; United (@united) <a href="https://twitter.com/united/status/562880943506325505">February 4, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

AndyBot forces me to recognize how predictable and stupid all of my tweets are, something I appreciate.
