---
layout: post
title:  Analyzing Tweets
excerpt: Taking a look at what makes my stupid Twitter work.
---

I spent last night with Python's [`nltk`](http://www.nltk.org/)—my initial focus was seeing if I could make [AndyBot]({{site.url}}/projects/andybot) smarter/more coherent. The results weren't great—a trained Hidden Markov Model produced equally incoherent sentences as the current random algorithm ("would friend do noodle using melting sibelius?"). Instead I used some of the analysis tools in `nltk` to view trends in my own tweets.

## Organizing The Corpus

The first step was creating a corpus of words for analysis—iterating through tweets and using the `nltk.pos_tag` to tag the parts of speech in each of them.

{% highlight python %}
for tweet in tweets:
  tweet_tokens = nltk.word_tokenize(tweet.decode('utf-8'))
  corpus += [nltk.pos_tag(tweet_tokens)]
{% endhighlight %}

The result of one of these tagged tweets looks something like this:
{% highlight python %}
[
 ('[', 'NN'),
 ('puts', 'VBZ'),
 ('on', 'IN'),
 ('live', 'JJ'),
 ('album', 'NN'),
 ('and', 'CC'),
 ('stands', 'VBZ'),
 ('in', 'IN'),
 ('apartment', 'NN'),
 ('tapping', 'VBG'),
 ('foot', 'NN'),
 ('for', 'IN'),
 ('2', 'CD'),
 ('hours', 'NNS'),
 (']', 'VBP')
]
{% endhighlight %}

## What I Talk About

I analyzed the corpus for the most common things I say—nouns, verbs, and n-grams.

{% highlight python %}
# iterate over the tagged text to find given prefix (NN/VB)
def findtags(tag_prefix, tagged_text):
  cfd = nltk.ConditionalFreqDist((tag, word) for (word, tag) in tagged_text
                                  if tag.startswith(tag_prefix))
  return dict((tag, cfd[tag].most_common(10)) for tag in cfd.conditions())
{% endhighlight %}

### Nouns:
{% highlight python %}
('NN',
  [('i', 519),
   ('http', 180),
   ('time', 78),
   ('someone', 66),
   ('https', 48),
   ('life', 45),
   ('day', 39),
   ('everyone', 36),
   ('man', 35),
   ('guy', 34)]
)
('NNP',
  [(']', 16),
   ('@', 15),
   ('TO', 13),
   ('Andy', 11),
   ('[', 10),
   ('A', 8),
   ('THE', 7),
   ('THIS', 7),
   ('IN', 7),
   ('My', 6)]
)
('NNS',
  [('i', 76),
   ('people', 69),
   ('things', 33),
   ('hours', 20),
   ('pants', 19),
   ('thanks', 17),
   ('minutes', 16),
   ('girls', 14),
   ('guys', 12),
   ('days', 12)]
)
{% endhighlight %}

There are clearly some issues with parsing tweets—'@', '[' and ']' are perceived as proper nouns and 'i' is perceived as plural in 76 cases.

My pronouns are also clearly skewed in terms of gender. Common contexts between 'guy' and 'girl' are 'the guy/girl who' and 'a guy/girl with'

{% highlight python %}
>>> tweet_text.common_contexts(['guy', 'girl'])
    the_who a_with
{% endhighlight %}

### Verbs:
{% highlight python %}
('VB',
  [('be', 156),
   ('have', 66),
   ('get', 59),
   ('i', 55),
   ('do', 54),
   ('know', 41),
   ('make', 33),
   ('see', 31),
   ('think', 27),
   ('say', 23)]
)
('VBD',
  [('was', 91),
  ('did', 34),
  ('were', 33),
  ('had', 32),
  ('got', 29),
  ('made', 24),
  ('said', 22),
  ('put', 18),
  ('saw', 12),
  ('thought', 12)]
)
{% endhighlight %}

No surprises here—this stacks up pretty evenly against all of English. 8 of the [most common verbs](http://www.linguasorb.com/english/verbs/most-common-verbs/) are represented here.

### n-grams:
n-grams, which are used when AndyBot generates tweets (specifically 3-grams), are groups of n words which appear sequentially within the corpus.
`nltk` has the `BigramCollcationFinder` and `TrigramCollcationFinder` classes which I used to determine the most frequently collated bigrams and trigrams.

{% highlight python %}
bigram_measures = nltk.collocations.BigramAssocMeasures()
bigram_finder = BigramCollocationFinder.from_words(words)
finder.apply_freq_filter(3) # filter out anything that appears less than 3 times
finder.nbest(bigram_measures.pmi, 10)
{% endhighlight %}

I can trace most of the following 3-grams to specific tweets/subjects: parodies of the "Now That's What I Call Music" genre, parodies of "it's not delivery, it's Digiorno", and parodies of "all my friends are getting married and having children and I'm...".

{% highlight python %}
[('chuck', 'e', 'cheese'),
 ('Now', "That's", 'What'),
 ('What', 'I', 'Call'),
 ("That's", 'What', 'I'),
 ("it's", 'not', 'delivery'),
 ('getting', 'married', 'and'),
 ('married', 'and', 'having'),
 ('my', 'water', 'bottle'),
 ('the', 'dining', 'hall'),
 ('the', 'police', 'come')]
{% endhighlight %}

The following bigrams are mostly two-part nouns, either proper or otherwise.

{% highlight python %}
[('grocery', 'store'),
 ('slam', 'poetry'),
 ('Here', 'lies'),
 ('hip', 'hop'),
 ('jerry', 'seinfeld'),
 ('harry', 'potter'),
 ('Dr.', 'Beat')]
{% endhighlight %}

## Summary
Overall, I'm not surprised to see the most common n-grams/nouns in the corpus of my tweets—they're all pretty mundane.

The lexical diversity of my tweets was pretty low—23% of words in the corpus were unique.
The calculation was the following:
{% highlight python %}
from nltk.corpus import wordnet
from __future__ import division


# only want english words (no urls, "aaaaaaah"s, etc)
english_words = []
for word in words:
  if wordnet.synsets(word.decode('utf-8')):
    english_words.append(word.lower())

len(set(english_words)) / len(english_words) => 0.23581050401089754
{% endhighlight %}

It's somewhat disheartening, but I've been able to make >4000 tweets out of only 4600 different words. I'll be interested to see if diversity will grow as the corpus does or if I've reached the limit of dumb words to say.
