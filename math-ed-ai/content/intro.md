
For the past few years, I've worn two separate hats: one hat of a math education researcher and the other of an AI math researcher. While there are others who wear both too (Kevin Buzzard and Jeremy Avigad come to mind), I generally keep the personas separate, not seeing how one field could contribute to my understanding of the other. However, the recent advances in LLMs have sparked the AI for math community to suddenly ask the same questions that math education researchers have been chipping away at for decades: What is the role of a proof? ([De Toffoli & Duede, 2026](https://terrytao.wordpress.com/2026/09/12/after-math/); [de Villiers, 1990](https://dynamicmathematicslearning.com/proofa.pdf)) What does it mean to understand a proof? ([Koberda & Kontorovich, 2026](https://arxiv.org/pdf/2610.14362); [Mejia-Ramos et al., 2012](https://link.springer.com/content/pdf/10.1007/s10649-011-9349-7.pdf)).


AI models have demonstrated superhuman math capabilities through recent achievements: Anthropic's Lean formalization of Fermat’s Last Theorem ([Anthropic, 2026](https://www.anthropic.com/research/formalizing-fermats-last-theorem)), OpenAI’s announced proof and Lean formalization of finite-time blowup for the forced Navier-Stokes equations ([OpenAI, 2026a](https://openai.com/index/navier-stokes-solution/); see also [Buckmaster, 2026](https://cims.nyu.edu/~tristanb/statement.pdf)), Axiom Math's formalization of CFSG ([Axiom, 2026](https://axiommath.ai/research/the-enormous-theorem-formalized/)), and most controversially, OpenAI’s release of 700+ proofs of research problems ([OpenAI, 2026b](https://openai.com/index/sharing-ai-progress-in-mathematics/)). The math community has been particularly divided over OpenAI's enormous proof "dump" ([Avigad et al., 2026](https://xenaproject.wordpress.com/2026/10/16/how-to-formalize-all-of-mathematics/)). 




Some mathematicians are celebrating the advancements these frontier labs have brought about,

<blockquote class="epigraph in-text">
<p>“Mathematics has undoubtedly moved forwards this week.” <span class="epigraph-cite">— Kevin Buzzard (<a href="https://proofsandprompts.com/2026/10/08/100-reactions-to-100-solutions/comment-page-1/">Proofs and Prompts, 2026</a>)</span></p>
</blockquote>

but others are doubtful, anxious, and concerned.

<blockquote class="epigraph in-text">
<p>“Today, something is lost forever... Today the machine came.” <span class="epigraph-cite">— Giovanni Mongardi (<a href="https://proofsandprompts.com/2026/10/08/100-reactions-to-100-solutions/comment-page-1/">Proofs and Prompts, 2026</a>)</span></p>
</blockquote>

<div class="reactions-more">
<button type="button" class="answer-toggle" aria-expanded="false" aria-controls="reactions-panel">Read more reactions from mathematicians</button>
<div id="reactions-panel" hidden>
<div data-include="content/reactions-quotes.html"></div>
</div>
</div>

Many mathematicians' reactions don't doubt the accuracy or significance of the mathematical breakthroughs, but rather raise more fundamental questions about what the discipline and culture of mathematics place value in. Proof education researchers have already tackled these questions about how the discipline operates in order to then initiate students into the practice of mathematics. They have spent their entire careers developing frameworks and definitions that explain how students approach, understand, construct, and verify proofs ([Iannone, 2025](https://www.youtube.com/watch?v=lTka1O209W4&t=90s)). **Applying these existing frameworks can help untangle the spectrum of responses AI-generated mathematics has evoked and provide new perspectives on how mathematicians and AI companies could move forward.**




I am interested in two issues:

<em><strong><a class="purple" href="#sociomathematical-norms">Sociomathematical norms</a></strong></em>: 
The critical reactions to OpenAI's proofs raise the question: What makes a mathematical proof acceptable to a community, beyond its technical correctness? Math education researchers have studied *sociomathematical norms* in classrooms, showing how the interpretation and acceptance of a “proof” depend on the norms of the community it is presented in. <span class="thesis norms"> For more mathematicians to embrace AI-generated proofs, these proofs must adhere to the community's existing sociomathematical norms.</span>

<em><strong><a class="green" href="#epistemic-role-of-lean">Epistemic role of Lean proofs</a></strong></em>: Lean and other theorem provers have the potential to remove the “trust bottleneck” ([Duong, 2026](https://www.simonsfoundation.org/news/from-trust-to-verification-leans-impact-on-mathematics/)) and reveal errors that human mathematicians may not spot in their proofs. Recently, AI companies have been using formal guarantees as a *sledgehammer* to demonstrate unequivocal correctness of a theorem. While this is valuable, <span class="thesis">I am interested in what affordances Lean can offer to mathematics practice beyond a binary verification signal. I believe Lean proofs can also help someone understand a proof better.</span>

**Overview**: In this post, I bring together two different demonstrations of AI use in mathematics: OpenAI's release of 700+ proofs, and my own research developing [LeanTutor](https://leantutor.org/), a formally verified proof tutor for undergraduates. I connect these two through theories and frameworks from math education, primarily Yackel and Cobb's ([1996](https://pubs.nctm.org/view/journals/jrme/27/4/article-p458.xml)) concept of *sociomathematical norms* and Harel and Sowder's ([1998](https://mathweb.ucsd.edu/~harel/Students%27%20Proof%20Schemes.pdf)) *proof schemes*. Drawing on mathematicians' responses to the OpenAI proof release and task-based interviews of undergraduate students interacting with LeanTutor, **I argue two things: (1) productive human-AI interaction in mathematics must preserve mathematicians' agency and engage with existing sociomathematical norms, and (2) Lean code can be used not just to verify a theorem, but to better understand a mathematical argument.** 
