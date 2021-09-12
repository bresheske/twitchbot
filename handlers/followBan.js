/**
 * So this handler reads from the messages that streamlabs sends out, and will
 * auto-ban anyone with particular criteria.  For example - Hoss or Host.  
 * 
 * Sample message from Streamlabs: 'Thank you for following mr_bucket_bot!'
 *                               : 'Thank you for following hoss00102020!'
 */
module.exports = (channel, tags, message, self, client) => {

    // first we check if the message came from streamlabs
    if(tags.username !== 'streamlabs')
        return;

    // now we check if the message was a 'new follower' message.
    const regex = /^Thank you for following ([^!]+)!$/g;
    if(!regex.test(message))
        return;

    // looks like it was a new follower. lets grab the name first.
    const follower = message.split(' ').pop().slice(0,-1);
    // note: the first pop gives us 'hoss!'.  the slice gives us 'hoss'.

    // now how do we determine if the follow was a threat?
    // well, for now probably just check if it starts with hoss.
    let threat = false;
    if (follower.toLowerCase().startsWith('hoss'))
        threat = true;
    
    // perhaps some other checks to go here.
    // more on this later. maybe there's some other ways to detect threats.

    // if there was a threat, it's time to act.
    if (threat) {
        client.say(channel, `/ban ${follower}`);
        client.say(channel, `@${follower}, you have been auto-banned. If you believe this is a mistake, contact the streamer.`);
    }

}