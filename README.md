# barlow-cluster
Node based compute cluster.

## What is it?
The barlow-cluster is a client/server framework to allow users to easily split high computational workloads into smaller chunks, and have dedicated systems process those jobs in a parallel manner. It leverages well known protocals available now rather than propietary technology to make the cluster as compatible as possible with whatever software that needs to interface with it.

## How does it work? TL;DR
The basic topology consists of a Manager, a number of Workers (who could also be managers), and Jobs.  The Manager is the control node, or rather the node with work to be done, the Worker is the basic compute unit, and the Job defines what runs.

When the Manager starts up, it listens via Bonjour for Workers to come online.  When a Worker starts up, it sends out a "hey, I'm here!" for the Manager to find.  Then, once the Manager is online, it can send jobs to the workers to process.

The workers also report back hardware status so the manager can make decisions on where to send jobs, or you can just do a round robin style (completely up to you).  The built-in Manager class also exposes a small webserver on port **22581** where you can see cluster stats.

## How do I send work to the cluster?
There are three main ideas on how to make the cluster do work, and I intend on supporting all three at some point, but I'm starting with the easier one at first.

These three ideas are:
- **Topology 1:** Your own custom code in the workers (in development)
- **Topology 2:** Dynamically pulling down code to run in the cluster (roadmap)
- **Topology 3:** Sending dynamic code through the job definition to be compiled and ran in the cluster (roadmap)

### Topology 1
This topology is one that most people will be familiar with in dealing with node apps. This assumes the user is in full control of the cluster, including the worker nodes.  In this scenario, the worker processes are self-contained instances fully aware of the code that is needed for execution.  Plugins are created and loaded into the server at run time (like any node server process), and it just waits for jobs.

In this scenario, the manager sends a fairly small payload consisting of
1. The plugin to execute
2. The data to process
3. What to do with the data upon completion

### Topology 2
This topology functions similarly to npm.  Instead of the workers knowing about plugins at runtime, the payload would contain a manifest (similar to a package.json) for the worker to download, then dynamically load what was pulled down to execute.  This scenario would be more beneficicial for clusters that were designed to be more general purpose, but still in a trusted environment.

Workers in this topology could respond to all manner of third party applications.  For example, a photo editing tool could have an embedded manager, and send filter operations out to an available cluster to be processed.  If you're editing multiple photos, each photo could be processd on a remote node -- all without the nodes needing to know about what they are processing.

### Topology 3
This Topology is similar to Topology 2 in that it's designed for general compute clusters, however the difference here is that instead of sending a manifest, the manager sends embedded code directly to the clusters to execute.

### Caviats
While interesting mental excercises, both Topologies 2 and 3 have significant security implications and some technicial implications to overcome before they can be viable.  As these features start to roll out, they will be user controllable so that your cluster isn't just open to the world.  The vision is that third party applications can start utilizing available clusters for desktop applications, dramatically adding utility to whatever environment you are in.

# Examples And Documentation
The built-in sample application is available here: [Samples](https://github.com/jnbarlow/barlow-cluster/tree/master/samples "Samples")

These samples contain a basic Manager/Worker set up.  To run them, execute the following commands in separate terminals:
- `npm run sample:worker`
- `npm run sample:client`

(may need to npm link while the framework remains unpublished)

## Documentation
todo :)